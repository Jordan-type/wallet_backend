const mailgun = require('mailgun-js');
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
// console.log('mailgun loaded', mg);

exports.sendEmail = (recipient, message) => {
    return new Promise((resolve, reject) => {
        const data = {
            from: `Yents <${process.env.MAILGUN_EMAIL_SENDER}>`,
            to: recipient,
            subject: message.subject,
            text: message.text
        }

        console.log('sending email', data);

        mg.messages().send(data, (error, body) => {
            if (error) {
                console.log('error sending email', error);
                reject(error);
            } else {
                console.log('email sent', body);
                resolve(body);
            }
        });
    });
}