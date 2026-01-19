// English translations
export const en = {
    // Common
    common: {
        appName: 'EduShare',
        tagline: 'Share & Learn Together in Oman',
        currency: 'OMR',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        search: 'Search',
        filter: 'Filter',
        clearAll: 'Clear All',
        noResults: 'No results found',
        viewAll: 'View All',
        learnMore: 'Learn More',
    },

    // Navigation
    nav: {
        browse: 'Browse Resources',
        share: 'Share Resource',
        requests: 'Request Board',
        library: 'Free Library',
        howItWorks: 'How It Works',
        signIn: 'Sign In',
        signUp: 'Get Started',
        signOut: 'Sign Out',
        profile: 'My Profile',
        myResources: 'My Resources',
    },

    // Home Page
    home: {
        heroTitle: 'Your Gateway to',
        heroTitleHighlight: 'Learning Success in Oman',
        heroSubtitle: 'Find summaries, past exams, and notes shared by students from UTAS, SQU, and more.',
        searchPlaceholder: 'Search for resources (e.g. MATH1200)...',
        browseBtn: 'Share a Resource',
        requestsBtn: 'View Requests',
        recentUploads: 'Recent Uploads',
        features: {
            title: 'Why Choose Us',
            titleHighlight: 'EduShare',
            subtitle: 'Everything you need to succeed in your studies',
            direct: {
                title: 'Direct Uploads',
                description: 'Share your resources instantly with thousands of students.'
            },
            requests: {
                title: 'Request Board',
                description: 'Need something specific? Ask the community for help.'
            },
            free: {
                title: 'Free Forever',
                description: 'Built for students, by students. No hidden fees.'
            }
        },
        howItWorks: {
            title: 'How It',
            titleHighlight: 'Works',
            subtitle: 'Start finding study resources in three simple steps',
            step1: {
                title: 'Sign Up',
                description: 'Create an account using your university email (.edu.om)',
            },
            step2: {
                title: 'Browse or Share',
                description: 'Find resources you need or share your own notes',
            },
            step3: {
                title: 'Study Smart',
                description: 'Access resources directly and ace your exams',
            },
        },
        cta: {
            title: 'Ready to Study Smarter?',
            subtitle: 'Join thousands of Omani students sharing study resources',
            button: 'Get Started Free',
        },
    },

    // Browse Page
    browse: {
        title: 'Browse',
        titleHighlight: 'Resources',
        subtitle: 'Discover study resources shared by verified students',
        searchPlaceholder: 'Search by title or course code...',
        allUniversities: 'All Universities',
        allTypes: 'All Types',
        resourcesFound: 'resources found',
        resourceFound: 'resource found',
        noResources: 'No resources found',
        noResourcesSubtitle: 'Try adjusting your filters or check back later',
        beFirst: 'Be the first to share a resource',
        activeFilters: 'Active filters:',
        viewResource: 'View Resource',
        author: 'Author',
        ctaTitle: 'Want to share your resources?',
        ctaSubtitle: 'Sign in with your university email (.edu.om) to start sharing your notes and summaries',
    },

    // Sell Page
    sell: {
        title: 'List a',
        titleHighlight: 'Book',
        subtitle: 'Share your textbook with other students and help them save money',
        form: {
            photo: 'Book Photo',
            photoOptional: '(Optional - Currently Disabled)',
            photoDisabled: 'Image Upload Temporarily Disabled',
            photoDisabledDesc: 'Firebase Storage is not configured. A placeholder image will be used for your listing.',
            clickToUpload: 'Click to upload',
            dragDrop: 'or drag and drop',
            imageFormats: 'PNG, JPG, GIF up to 5MB',
            title: 'Book Title',
            titlePlaceholder: 'e.g., Introduction to Algorithms',
            description: 'Description',
            descriptionPlaceholder: "Describe the book's condition, edition, any highlights or notes...",
            price: 'Price (OMR)',
            condition: 'Condition',
            selectCondition: 'Select condition',
            university: 'University',
            selectUniversity: 'Select university',
            major: 'Major',
            selectMajor: 'Select major',
            whatsappNumber: 'WhatsApp Number',
            phonePlaceholder: '91234567',
            phoneHelp: 'Enter your 8-digit Omani mobile number. Buyers will contact you via WhatsApp.',
            createListing: 'Create Listing',
            creatingListing: 'Creating Listing...',
        },
        errors: {
            required: 'is required',
            invalidPrice: 'Valid price is required',
            photoRequired: 'Please upload a book photo',
            loginRequired: 'You must be logged in to create a listing. Please sign in and try again.',
        },
    },

    // Library Page
    library: {
        badge: '100% Free Resources',
        title: 'Free',
        titleHighlight: 'Library',
        subtitle: 'Access thousands of free educational textbooks and resources from Open Library',
        searchPlaceholder: 'Search for free textbooks...',
        browseBySubject: 'Browse by Subject',
        booksAvailable: 'free books available',
        bookAvailable: 'free book available',
        readOnline: 'Read Online',
        aboutTitle: 'About Open Library',
        aboutText: 'Open Library is an open, editable library catalog, building towards a web page for every book ever published. All books available here are free to read online and are in the public domain or have been made available by publishers.',
        visitOpenLibrary: 'Visit Open Library',
        internetArchive: 'Internet Archive',
    },

    // Auth Pages
    auth: {
        signUp: {
            title: 'Create Account',
            subtitle: 'Join with your university email',
            emailLabel: 'University Email',
            emailPlaceholder: 'student@squ.edu.om',
            emailHelp: 'Must end with .edu.om (e.g., @squ.edu.om, @gutech.edu.om)',
            passwordLabel: 'Password',
            passwordPlaceholder: 'At least 6 characters',
            confirmPasswordLabel: 'Confirm Password',
            confirmPasswordPlaceholder: 'Re-enter your password',
            submitBtn: 'Create Account',
            creatingAccount: 'Creating Account...',
            hasAccount: 'Already have an account?',
            signInLink: 'Sign In',
            backToHome: '← Back to Home',
            success: {
                title: 'Verification Email Sent!',
                message: 'We sent a verification link to your university email. Please click it to activate your account.',
                checkSpam: "Check your spam folder if you don't see it in your inbox.",
                goToSignIn: 'Go to Sign In',
            },
            errors: {
                passwordLength: 'Password must be at least 6 characters',
                passwordMismatch: 'Passwords do not match',
                invalidEmail: 'Please use your university email ending with .edu.om (e.g., @squ.edu.om, @gutech.edu.om)',
                emailInUse: 'This email is already registered. Please sign in instead.',
                weakPassword: 'Password should be at least 6 characters',
                generic: 'Failed to create account. Please try again.',
            },
        },
        signIn: {
            title: 'Welcome Back',
            subtitle: 'Sign in to your account',
            emailLabel: 'University Email',
            emailPlaceholder: 'student@squ.edu.om',
            passwordLabel: 'Password',
            passwordPlaceholder: 'Enter your password',
            submitBtn: 'Sign In',
            signingIn: 'Signing In...',
            noAccount: "Don't have an account?",
            signUpLink: 'Create Account',
            backToHome: '← Back to Home',
            errors: {
                invalidCredentials: 'Invalid email or password',
                verifyEmail: 'Please verify your email first by clicking the link sent to your inbox.',
                tooManyAttempts: 'Too many failed login attempts. Please try again later.',
                generic: 'Failed to sign in. Please try again.',
            },
        },
    },

    // Profile Page
    profile: {
        editProfile: 'Edit Profile',
        saveChanges: 'Save Changes',
        displayName: 'Display Name',
        phoneNumber: 'Phone Number (for WhatsApp)',
        phonePlaceholder: 'e.g., +96891234567',
        university: 'University',
        selectUniversity: 'Select University',
        verifiedStudent: 'Verified Student',
        listings: 'Listings',
        active: 'Active',
        myListings: 'My Listings',
        newListing: '+ New Listing',
        noListings: 'No listings yet',
        noListingsSubtitle: 'Start selling your textbooks to help fellow students',
        createFirstListing: 'Create Your First Listing',
    },

    // WhatsApp Messages
    whatsapp: {
        buyMessage: "Hi! I'm interested in buying",
        fromPlatform: 'from EduShare.',
    },

    // Footer
    footer: {
        description: 'The trusted platform for Omani university students to share and discover study resources.',
        quickLinks: 'Quick Links',
        universities: 'Universities',
        legal: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        copyright: '© 2024 EduShare. All rights reserved.',
        madeWith: 'Made with',
        forStudents: 'for Omani students',
    },

    // Book Conditions
    conditions: {
        new: 'New',
        likeNew: 'Like New',
        good: 'Good',
        fair: 'Fair',
        poor: 'Poor',
    },
};

// Arabic translations
export const ar = {
    // Common
    common: {
        appName: 'إيدو شير',
        tagline: 'شارك وتعلم معاً في عُمان',
        currency: 'ر.ع.',
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجاح',
        cancel: 'إلغاء',
        save: 'حفظ',
        delete: 'حذف',
        edit: 'تعديل',
        search: 'بحث',
        filter: 'تصفية',
        clearAll: 'مسح الكل',
        noResults: 'لا توجد نتائج',
        viewAll: 'عرض الكل',
        learnMore: 'اعرف المزيد',
    },

    // Navigation
    nav: {
        browse: 'تصفح الموارد',
        share: 'شارك مورد',
        requests: 'لوحة الطلبات',
        library: 'المكتبة المجانية',
        howItWorks: 'كيف يعمل',
        signIn: 'تسجيل الدخول',
        signUp: 'ابدأ الآن',
        signOut: 'تسجيل الخروج',
        profile: 'ملفي الشخصي',
        myResources: 'مواردي',
    },

    // Home Page
    home: {
        heroTitle: 'بوابتك إلى',
        heroTitleHighlight: 'التميز الأكاديمي في عُمان',
        heroSubtitle: 'اعثر على ملخصات، امتحانات سابقة، وملاحظات مشاركة من طلاب UTAS، SQU، والمزيد.',
        searchPlaceholder: 'ابحث عن موارد (مثل MATH1200)...',
        browseBtn: 'شارك مورداً',
        requestsBtn: 'عرض الطلبات',
        recentUploads: 'أحدث الإضافات',
        features: {
            title: 'لماذا تختارنا',
            titleHighlight: 'إيدو شير',
            subtitle: 'كل ما تحتاجه للنجاح في دراستك',
            direct: {
                title: 'رفع مباشر',
                description: 'شارك مواردك فوراً مع آلاف الطلاب.'
            },
            requests: {
                title: 'لوحة الطلبات',
                description: 'تحتاج شيئاً محدداً؟ اطلب المساعدة من المجتمع.'
            },
            free: {
                title: 'مجاني دائماً',
                description: 'من الطلاب وللطلاب. بدون رسوم مخفية.'
            }
        },
        howItWorks: {
            title: 'كيف',
            titleHighlight: 'يعمل',
            subtitle: 'ابدأ باكتشاف موارد الدراسة في ثلاث خطوات بسيطة',
            step1: {
                title: 'سجل حساب',
                description: 'أنشئ حساباً باستخدام بريدك الجامعي (.edu.om)',
            },
            step2: {
                title: 'تصفح أو شارك',
                description: 'اعثر على الموارد التي تحتاجها أو شارك ملاحظاتك',
            },
            step3: {
                title: 'ادرس بذكاء',
                description: 'اطلع على الموارد مباشرة وتفوق في امتحاناتك',
            },
        },
        cta: {
            title: 'مستعد للدراسة بذكاء؟',
            subtitle: 'انضم لآلاف الطلاب العمانيين الذين يشاركون موارد الدراسة',
            button: 'ابدأ مجاناً',
        },
    },

    // Browse Page
    browse: {
        title: 'تصفح',
        titleHighlight: 'الموارد',
        subtitle: 'اكتشف موارد الدراسة المشاركة من طلاب موثقين',
        searchPlaceholder: 'ابحث بالعنوان أو رمز المقرر...',
        allUniversities: 'جميع الجامعات',
        allTypes: 'جميع الأنواع',
        resourcesFound: 'مورد متاح',
        resourceFound: 'مورد متاح',
        noResources: 'لا توجد موارد',
        noResourcesSubtitle: 'جرب تغيير الفلاتر أو تحقق لاحقاً',
        beFirst: 'كن أول من يشارك مورداً',
        activeFilters: 'الفلاتر النشطة:',
        viewResource: 'عرض المورد',
        author: 'المؤلف',
        ctaTitle: 'تريد مشاركة مواردك؟',
        ctaSubtitle: 'سجل دخولك ببريدك الجامعي (.edu.om) لبدء مشاركة ملاحظاتك وملخصاتك',
    },

    // Sell Page
    sell: {
        title: 'أضف',
        titleHighlight: 'كتاب',
        subtitle: 'شارك كتابك مع الطلاب الآخرين وساعدهم على التوفير',
        form: {
            photo: 'صورة الكتاب',
            photoOptional: '(اختياري - معطل حالياً)',
            photoDisabled: 'رفع الصور معطل مؤقتاً',
            photoDisabledDesc: 'Firebase Storage غير مُعَد. سيتم استخدام صورة افتراضية لإعلانك.',
            clickToUpload: 'اضغط للرفع',
            dragDrop: 'أو اسحب وأفلت',
            imageFormats: 'PNG, JPG, GIF حتى 5 ميجابايت',
            title: 'عنوان الكتاب',
            titlePlaceholder: 'مثال: مقدمة في الخوارزميات',
            description: 'الوصف',
            descriptionPlaceholder: 'صف حالة الكتاب، الطبعة، أي تظليلات أو ملاحظات...',
            price: 'السعر (ر.ع.)',
            condition: 'الحالة',
            selectCondition: 'اختر الحالة',
            university: 'الجامعة',
            selectUniversity: 'اختر الجامعة',
            major: 'التخصص',
            selectMajor: 'اختر التخصص',
            whatsappNumber: 'رقم واتساب',
            phonePlaceholder: '91234567',
            phoneHelp: 'أدخل رقم هاتفك العماني المكون من 8 أرقام. المشترون سيتواصلون معك عبر واتساب.',
            createListing: 'إنشاء الإعلان',
            creatingListing: 'جاري إنشاء الإعلان...',
        },
        errors: {
            required: 'مطلوب',
            invalidPrice: 'السعر المطلوب غير صالح',
            photoRequired: 'يرجى رفع صورة الكتاب',
            loginRequired: 'يجب تسجيل الدخول لإنشاء إعلان. يرجى تسجيل الدخول والمحاولة مرة أخرى.',
        },
    },

    // Library Page
    library: {
        badge: 'موارد مجانية 100%',
        title: 'المكتبة',
        titleHighlight: 'المجانية',
        subtitle: 'الوصول لآلاف الكتب التعليمية المجانية من Open Library',
        searchPlaceholder: 'ابحث عن كتب مجانية...',
        browseBySubject: 'تصفح حسب الموضوع',
        booksAvailable: 'كتاب مجاني متاح',
        bookAvailable: 'كتاب مجاني متاح',
        readOnline: 'اقرأ أونلاين',
        aboutTitle: 'عن Open Library',
        aboutText: 'Open Library هي مكتبة مفتوحة وقابلة للتحرير، تعمل على إنشاء صفحة لكل كتاب نُشر على الإطلاق. جميع الكتب المتاحة هنا مجانية للقراءة وهي في الملك العام أو أتاحها الناشرون.',
        visitOpenLibrary: 'زيارة Open Library',
        internetArchive: 'أرشيف الإنترنت',
    },

    // Auth Pages
    auth: {
        signUp: {
            title: 'إنشاء حساب',
            subtitle: 'انضم ببريدك الجامعي',
            emailLabel: 'البريد الجامعي',
            emailPlaceholder: 'student@squ.edu.om',
            emailHelp: 'يجب أن ينتهي بـ .edu.om (مثال: @squ.edu.om)',
            passwordLabel: 'كلمة المرور',
            passwordPlaceholder: '6 أحرف على الأقل',
            confirmPasswordLabel: 'تأكيد كلمة المرور',
            confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
            submitBtn: 'إنشاء حساب',
            creatingAccount: 'جاري إنشاء الحساب...',
            hasAccount: 'لديك حساب؟',
            signInLink: 'تسجيل الدخول',
            backToHome: '→ العودة للرئيسية',
            success: {
                title: 'تم إرسال رابط التحقق!',
                message: 'أرسلنا رابط تحقق لبريدك الجامعي. يرجى الضغط عليه لتفعيل حسابك.',
                checkSpam: 'تحقق من مجلد الرسائل غير المرغوبة إذا لم تجده في صندوق الوارد.',
                goToSignIn: 'الذهاب لتسجيل الدخول',
            },
            errors: {
                passwordLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                passwordMismatch: 'كلمتا المرور غير متطابقتين',
                invalidEmail: 'يرجى استخدام بريدك الجامعي المنتهي بـ .edu.om',
                emailInUse: 'هذا البريد مسجل مسبقاً. يرجى تسجيل الدخول بدلاً من ذلك.',
                weakPassword: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                generic: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
            },
        },
        signIn: {
            title: 'مرحباً بعودتك',
            subtitle: 'سجل دخولك لحسابك',
            emailLabel: 'البريد الجامعي',
            emailPlaceholder: 'student@squ.edu.om',
            passwordLabel: 'كلمة المرور',
            passwordPlaceholder: 'أدخل كلمة المرور',
            submitBtn: 'تسجيل الدخول',
            signingIn: 'جاري تسجيل الدخول...',
            noAccount: 'ليس لديك حساب؟',
            signUpLink: 'إنشاء حساب',
            backToHome: '→ العودة للرئيسية',
            errors: {
                invalidCredentials: 'البريد أو كلمة المرور غير صحيحة',
                verifyEmail: 'يرجى تأكيد بريدك أولاً بالضغط على الرابط المرسل.',
                tooManyAttempts: 'محاولات كثيرة فاشلة. يرجى المحاولة لاحقاً.',
                generic: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.',
            },
        },
    },

    // Profile Page
    profile: {
        editProfile: 'تعديل الملف الشخصي',
        saveChanges: 'حفظ التغييرات',
        displayName: 'الاسم المعروض',
        phoneNumber: 'رقم الهاتف (للواتساب)',
        phonePlaceholder: 'مثال: +96891234567',
        university: 'الجامعة',
        selectUniversity: 'اختر الجامعة',
        verifiedStudent: 'طالب موثق',
        listings: 'الإعلانات',
        active: 'نشط',
        myListings: 'إعلاناتي',
        newListing: '+ إعلان جديد',
        noListings: 'لا توجد إعلانات',
        noListingsSubtitle: 'ابدأ ببيع كتبك لمساعدة زملائك الطلاب',
        createFirstListing: 'أنشئ إعلانك الأول',
    },

    // WhatsApp Messages
    whatsapp: {
        buyMessage: 'مرحباً! أرغب في شراء',
        fromPlatform: 'من إيدو شير.',
    },

    // Footer
    footer: {
        description: 'المنصة الموثوقة لطلاب الجامعات العمانية لمشاركة واكتشاف موارد الدراسة.',
        quickLinks: 'روابط سريعة',
        universities: 'الجامعات',
        legal: 'قانوني',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        copyright: '© 2024 إيدو شير. جميع الحقوق محفوظة.',
        madeWith: 'صُنع بـ',
        forStudents: 'للطلاب العمانيين',
    },

    // Book Conditions
    conditions: {
        new: 'جديد',
        likeNew: 'شبه جديد',
        good: 'جيد',
        fair: 'مقبول',
        poor: 'رديء',
    },
};

export type Locale = typeof en;
export type LocaleKey = 'en' | 'ar';
