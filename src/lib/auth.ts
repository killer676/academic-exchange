import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '@/types';

// دالة مساعدة للتحقق من نطاق الجامعة
const isValidEduEmail = (email: string) => {
    const eduDomains = ['.edu.om', 'squ.edu.om', 'utas.edu.om', 'gutech.edu.om'];
    return eduDomains.some(domain => email.endsWith(domain));
};

/**
 * 1. تسجيل حساب جديد (Sign Up)
 */
export async function signUpWithEmail(email: string, pass: string, name: string) {
    // 1. التحقق من النطاق
    if (!isValidEduEmail(email)) {
        throw new Error('Please use a valid university email (.edu.om)');
    }

    // 2. إنشاء الحساب
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;

    // 3. إرسال رابط التفعيل فوراً
    await sendEmailVerification(firebaseUser);

    // 4. حفظ بيانات الطالب في الداتابيس
    const newUser = {
        email: firebaseUser.email,
        displayName: name,
        isVerifiedStudent: false, // سيبقى false حتى يفعل الإيميل
        university: 'UTAS', // قيمة افتراضية يمكن تعديلها لاحقاً
        createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

    // 5. تسجيل الخروج فوراً (لإجباره على التفعيل)
    await signOut(auth);

    return firebaseUser;
}

/**
 * 2. تسجيل الدخول (Login) مع الحماية
 */
export async function loginWithEmail(email: string, pass: string) {
    // 1. محاولة الدخول
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // 2. الشرطي: هل الإيميل مفعل؟
    if (!user.emailVerified) {
        await signOut(auth); // طرد المستخدم
        throw new Error('Email not verified! Please check your inbox.');
    }

    return user;
}

/**
 * 3. تسجيل الخروج
 */
export async function signOutUser() {
    await signOut(auth);
}