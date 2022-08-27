const mg = require('../config/mailgun');
const emailTemplate = require('../template/emailTemplate');

exports.sendEmail = async (email, type, host, data) => {
    let result
    let response

    try {
        const message = prepareTemplate(type, host, data);
        
        response = await mg.sendEmail(email, message);
        console.log('email sent...', response);
    } catch (error) {
        console.log('error sending email', error);
        throw error;
    }

    if(response) {
        result = response;
    }

    return result;
}

const prepareTemplate = (type, host, data) => {
    let message

    switch (type) {
        case 'account-activation-link':
            message = emailTemplate.accountActivationLink(host, data);
            break;
        case 'reset-password-link':
            message = emailTemplate.resetPasswordLink(host, data);
            break;
        default:
            message = ''
    }

    return message;
}