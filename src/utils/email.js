import dotenv from "dotenv";
dotenv.config();

const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const fs = require("fs");

const mg = mailgun.client({
  username: process.env.MAILGUN_USERNAME,
  key: process.env.MAILGUN_API_KEY,
  url: "https://api.eu.mailgun.net",
});



const sendMail = async function (to, subject, message, url, btn_action) {

  let html = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
    rel="stylesheet"
/>
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Inter:wght@100..900&display=swap');
  
          body {
              
          }
  
          .mail-table {
              font-family: "Archivo", Arial, sans-serif !important;
              background-color: #54c4d028 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 50px 60px !important;
          }
  
          p {
              color: #333333 !important;
              line-height: 30px;
          }
  
          .mail-content {
              background-color: #ffffff;
              padding: 32px 32px !important;
              width: 100% !important;
          }
  
          @media (max-width: 800px) {
              body {
                  padding: 50px 20px;
              }
  
              .mail-table {
                  padding: 0px !important;
              }

              .mail-content {
                background-color: #ffffff;
                padding: 32px 5px !important;
                width: 100% !important;
            }
          }
      </style>
  </head>
  
  <body>
      <table class="mail-table" cellpadding="0" cellspacing="0" width="100%">
          <tr>
              <td style="padding: 24px;">
              <img src="https://res.cloudinary.com/coladgray/image/upload/v1712147319/kjpf5xff6htolwlcjh3c.png" alt="Colad Gray">
              </td>
          </tr>
          <tr class="mail-content">
              <td style="padding: 32px;">
                  <p>${message}</p>
                  ${url ? `<a href="${url}" style="background-color: #239FAC; border-radius: 50px; padding: 8px 16px; font-size: 14px; color: #ffffff; text-decoration: none;">${btn_action}</a>` : ``}
              </td>
  
          </tr>
          <tr>
              <td class="" style="background-color: #F7F9FC; padding: 32px;">
                  <p style="font-size: 14px; line-height: 25px;">This email was sent to <span
                          style="text-decoration: underline; color: #54C4D0; font-size: 14px;">${to}</span>
                      If you’d rather not receive this kind of email, you can <span style="color: #54C4D0;">unsubscribe or
                          manage your email preferences.</span></p>
                  <p style="font-size: 14px;">CChub, Yaba, Lagos.</p>
  
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 28px;">
                     <img src="https://res.cloudinary.com/coladgray/image/upload/v1712147628/dgxphntlluf3zrilmf80.png">
                      <div style="display: flex; align-items: center; gap: 24px;">
                      <i class="ri-twitter-fill" style="font-size: 18px; color: #6A7C94;"></i>
                      <i class="ri-facebook-box-fill" style="font-size: 18px; color: #6A7C94;"></i>     
                      <i class="ri-linkedin-box-fill" style="font-size: 18px; color: #6A7C94;"></i>
                      </div>
                  </div>
              </td>
          </tr>
      </table>
  </body>
  
  </html>`
  const data = {
    from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
    to,
    subject,
    html,
  };
  try {
    const isSent = await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
    if (isSent) return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { sendMail };
