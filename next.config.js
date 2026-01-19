/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // ⚠️ تحذير: هذا يسمح برفع الكود حتى لو فيه أخطاء تايب سكريبت
        ignoreBuildErrors: true,
    },
    eslint: {
        // ⚠️ تحذير: هذا يسمح برفع الكود حتى لو فيه أخطاء تنسيق
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'], // عشان صور جوجل والملفات تشتغل
    },
};

export default nextConfig;