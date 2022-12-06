const mailer = require('./mailer');

exports.applicationNotify = (options) => {
    const defaultOptions = {
        subject: 'Vorwerk notification ✔️',
        view: 'product-notification'
    }

    return mailer.send(Object.assign(defaultOptions, options));
}