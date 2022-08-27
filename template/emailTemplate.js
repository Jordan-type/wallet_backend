//  email activation link
const accountActivationLink = (host, token) => {
    const message = {
        subject: 'Account Activation Link',
        text: `Please use the following link to activate your account:${host}/auth/account-activation/${token}`
    };

    return message;
}

// reset password link
const resetPasswordLink = (host, token) => {
    const message = {
        subject: 'Reset Password Link',
        text: `Please use the following link to reset your password:${host}/auth/reset-password/${token}`
    };

    return message;
}

const otpEmail = (host, otp) => {
    const message = {
        subject: 'One Time Password',
        text: `Your OTP is ${otp}`
    };

    return message;
}


module.exports = {
    accountActivationLink,
    resetPasswordLink,
    otpEmail
}