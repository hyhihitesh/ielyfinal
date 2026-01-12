
export default function TermsPage() {
    return (
        <main className="container mx-auto px-4 py-24 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
            <div className="prose dark:prose-invert prose-slate">
                <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Agreement to Terms</h2>
                <p>
                    These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Piely ("we," "us" or "our"), concerning your access to and use of the Piely website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                </p>

                <h2>2. Intellectual Property Rights</h2>
                <p>
                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                </p>

                <h2>3. User Representations</h2>
                <p>
                    By using the Site, you represent and warrant that:
                </p>
                <ul>
                    <li>All registration information you submit will be true, accurate, current, and complete.</li>
                    <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                    <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                    <li>You are not a minor in the jurisdiction in which you reside.</li>
                </ul>

                <h2>4. Fees and Payment</h2>
                <p>
                    We accept the following forms of payment: Visa, Mastercard, American Express, Discover. You may be required to purchase or pay a fee to access some of our services. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site.
                </p>

                <h2>5. Contact Us</h2>
                <p>
                    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at support@piely.com.
                </p>
            </div>
        </main>
    )
}
