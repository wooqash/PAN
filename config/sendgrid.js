const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const message = {};
message.from = 'lukasz@zibeline.pl';
message.mail_settings = {
    sandbox_mode: {
        enable: false
    }
}

exports.message = message;