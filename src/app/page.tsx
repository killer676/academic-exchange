import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen gradient-bg text-white overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm text-gray-300">Exclusively for Omani Students</span>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
                        <span className="block">Buy & Sell</span>
                        <span className="gradient-text">University Textbooks</span>
                        <span className="block mt-2">in Oman</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                        The trusted marketplace connecting verified Omani university students.
                        Save up to 70% on textbooks and help fellow students succeed.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link href="/browse" className="btn-primary text-lg px-10 py-4 w-full sm:w-auto">
                            Browse Books
                        </Link>
                        <Link
                            href="/signup"
                            className="group flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300 w-full sm:w-auto justify-center"
                        >
                            <span>Start Selling</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
                        {[
                            { value: '1000+', label: 'Active Listings' },
                            { value: '5000+', label: 'Students Registered' },
                            { value: '70%', label: 'Average Savings' },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl lg:text-4xl font-bold gradient-text">{stat.value}</div>
                                <div className="text-gray-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section header */}
                    <div className="text-center mb-20">
                        <span className="text-purple-400 font-semibold tracking-wider uppercase text-sm">Why Choose Us</span>
                        <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
                            Built for <span className="gradient-text">Omani Students</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            A secure, student-only platform designed specifically for university communities across Oman.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="feature-card group">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Verified Students Only</h3>
                            <p className="text-gray-400 leading-relaxed">
                                We verify all users with .edu.om email addresses to ensure a safe,
                                trusted community of real Omani university students.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-card group">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Save Up to 70%</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Buy used textbooks at a fraction of the retail price. Sell your
                                old books and earn money back on your investment.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-card group">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">WhatsApp Chat</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Connect directly with sellers via WhatsApp for quick, convenient
                                communication and hassle-free transactions.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-card group">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Smart Filters</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Find exactly what you need with filters for university, major,
                                condition, and price. Search smarter, not harder.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="feature-card group">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Photo Listings</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Upload photos of your books so buyers can see the actual condition.
                                No surprises, just honest transactions.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="feature-card group">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">All Universities</h3>
                            <p className="text-gray-400 leading-relaxed">
                                From SQU to GUtech, Nizwa to Dhofar – we support students from
                                all major universities across Oman.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="relative py-32 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section header */}
                    <div className="text-center mb-20">
                        <span className="text-purple-400 font-semibold tracking-wider uppercase text-sm">Simple Process</span>
                        <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Get started in minutes. Whether you&apos;re buying or selling, we&apos;ve made the process seamless.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Step 1 */}
                        <div className="relative text-center group">
                            <div className="relative inline-flex mb-8">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-xl shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                                    1
                                </div>
                                {/* Connector line */}
                                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Sign Up with Google</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Create your account using your university email (.edu.om) to join our verified student community.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative text-center group">
                            <div className="relative inline-flex mb-8">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl font-bold shadow-xl shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
                                    2
                                </div>
                                {/* Connector line */}
                                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-pink-500 to-transparent" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Browse or List</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Search for textbooks by university and major, or list your own books with photos and descriptions.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative text-center group">
                            <div className="inline-flex mb-8">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-3xl font-bold shadow-xl shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                                    3
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Connect & Exchange</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Contact sellers directly via WhatsApp, meet up on campus, and complete your exchange safely.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Glow effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                    </div>

                    <div className="relative">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to <span className="gradient-text">Save on Textbooks?</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                            Join thousands of Omani students who are already saving money and helping each other succeed academically.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/signup" className="btn-primary text-lg px-12 py-4 animate-pulse-glow">
                                Get Started Free
                            </Link>
                            <Link href="/browse" className="text-gray-300 hover:text-white transition-colors font-medium">
                                Or browse listings first →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
