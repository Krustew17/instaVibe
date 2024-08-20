export default function getPRHTML(username, resetLink) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 50px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      font-size: 24px;
      color: #333;
      text-align: center;
    }
    .content {
      font-size: 16px;
      color: #555;
    }
    .cta {
      margin: 20px 0;
      text-align: center;
    }
    .cta a {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007BFF;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
    .cta a:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Password Reset Request
    </div>
    <div class="content">
      <p>Hello ${username},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <div class="cta">
        <a href="${resetLink}" target="_blank">Reset Your Password</a>
      </div>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <p>Thank you,<br>instaVibe</p>
    </div>
  </div>
</body>
</html>
        `;
}
