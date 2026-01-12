
export default function PrivacyPage() {
    return (
        <main className="container mx-auto px-4 py-24 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose dark:prose-invert prose-slate">
                <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Introduction</h2>
                <p>
                    Welcome to Piely ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our application.
                </p>

                <h2>2. Information We Collect</h2>
                <p>
                    We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application, or otherwise when you contact us.
                </p>

                <h3>Personal Information Provided by You</h3>
                <p>The personal information that we collect depends on the context of your interactions with us and the application, constraints, and the products and features you use. The personal information we collect may include the following:</p>
                <ul>
                    <li>Names</li>
                    <li>Email addresses</li>
                    <li>Passwords (hashed)</li>
                    <li>Billing information (processed by our payment providers)</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>
                    We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                </p>
                <ul>
                    <li><strong>To facilitate account creation and logon process.</strong></li>
                    <li><strong>To post testimonials.</strong> We post testimonials on our application that may contain personal information.</li>
                    <li><strong>Request feedback.</strong> We may use your information to request feedback and to contact you about your use of our application.</li>
                    <li><strong>To manage user accounts.</strong> We may use your information for the purposes of managing our account and keeping it in working order.</li>
                </ul>

                <h2>4. Contact Us</h2>
                <p>
                    If you have specific questions or concerns about this privacy policy, you can contact us at support@piely.com.
                </p>
            </div>
        </main>
    )
}
