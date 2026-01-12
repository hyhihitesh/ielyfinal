import { Resend } from 'resend'

interface SendEmailOptions {
    to: string
    subject: string
    html: string
    from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
    const fromEmail = from ?? 'Piely <noreply@piely.app>'
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
        console.error('RESEND_API_KEY is missing')
        return { success: false, error: 'Configuration error' }
    }

    const resend = new Resend(apiKey)

    try {
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to,
            subject,
            html,
        })

        if (error) {
            console.error('Failed to send email:', error.message)
            return { success: false, error: error.message }
        }

        return { success: true, id: data?.id }
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('Email send error:', message)
        return { success: false, error: message }
    }
}

// Reminder email template
export function getReminderEmailHtml(userName: string, projectTitle: string, daysInactive: number): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We miss you!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #1a1a1a; border-radius: 16px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #FF6B35, #87CEEB); border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 28px;">🚀</span>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                                Hey ${userName}! 👋
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p style="margin: 0 0 20px; color: #a1a1a1; font-size: 16px; line-height: 1.6;">
                                We noticed you haven't visited <strong style="color: #ffffff;">${projectTitle}</strong> in ${daysInactive} days.
                            </p>
                            <p style="margin: 0 0 30px; color: #a1a1a1; font-size: 16px; line-height: 1.6;">
                                Your startup journey is waiting! Even small progress adds up over time. 
                                Take 5 minutes today to check off a task or review your roadmap.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                                           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FF6B35, #FF8F5C); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                                            Continue Building →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; border-top: 1px solid #2a2a2a;">
                            <p style="margin: 0; color: #666666; font-size: 12px; text-align: center;">
                                You're receiving this because you signed up for Piely.<br>
                                <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #888888;">Manage preferences</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`
}
