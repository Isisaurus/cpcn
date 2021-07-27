const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// email class for complex email handling
module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.from = `${process.env.EMAIL_FROM}`;
    this.administration = `${process.env.EMAIL_ADMIN}`;
  }

  newTransport() {
    // use mailtrap service in development
    if (process.env.NODE_ENV === 'development') {
      // Mailtrap transporter
      return nodemailer.createTransport({
        host: process.env.EMAIL_TRAP_HOST,
        port: process.env.EMAIL_TRAP_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    // send real emails in production
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid transporter
      return nodemailer.createTransport({
        service: 'SendGrid',
        host: 'in.mailsac.com',
        secure: false,
        port: 25,
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    }
  }

  async send(template, subject) {
    // send actual email
    // 1: render html for the email based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        subject: this.subject,
        user: this.user,
      }
    );
    // 2: define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    // 3: create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  // determine type of email
  async sendWelcome(user) {
    // await this.send('welcome', 'Welcome to CPCN!');
    const html = pug.renderFile(`${__dirname}/../views/emails/welcome.pug`, {
      user,
    });
    // 2: define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'CPCN Membership application confirmation',
      html,
      text: htmlToText.fromString(html),
    };
    // 3: create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendDetails(user) {
    const html = pug.renderFile(`${__dirname}/../views/emails/details.pug`, {
      user,
    });
    // 2: define email options
    const mailOptions = {
      from: this.from,
      to: this.administration,
      subject: 'Membership application',
      html,
      text: htmlToText.fromString(html),
    };
    // 3: create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async contact(sender) {
    const html = pug.renderFile(`${__dirname}/../views/emails/contact.pug`, {
      sender,
    });
    // 2: define email options
    const mailOptions = {
      from: this.from,
      to: this.administration,
      subject: 'Contact form',
      html,
      text: htmlToText.fromString(html),
    };
    // 3: create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
};

// goal:
// new Email({user, url}).sendWelcome();

// old solution with mailtrap service
// const sendEmail = async (options) => {
//   // create transporter - a service
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_TRAP_HOST,
//     port: process.env.EMAIL_TRAP_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   // define email options
//   const mailOptions = {
//     from: 'CPCN-test <dianavitanyi@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//   // actually send email with nodemailer
//   await transporter.sendMail(mailOptions);
// };
