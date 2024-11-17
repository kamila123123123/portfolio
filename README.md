# Portfolio Platform

This is a portfolio platform that allows users to create and manage their portfolios. The platform supports user registration, login, two-factor authentication (2FA), and role-based access control (RBAC) for admin and editor roles.

## Features

- **User Registration**: Users can sign up with their details (username, password, first name, last name, age, gender). Passwords are hashed using bcrypt for security.
- **User Login**: Users can log in using their credentials, and if 2FA is enabled, they are prompted to enter a 2FA code.
- **Role-based Access Control**: The platform has two user roles: `admin` and `editor`. Admins can manage content, while editors can contribute but have limited access.
- **Two-factor Authentication (2FA)**: Users can enable 2FA for enhanced security. The platform uses the Speakeasy package to generate 2FA tokens.
- **Email Notifications**: Nodemailer is used to send welcome emails after registration.

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: bcrypt, JWT, speakeasy (2FA)
- **Email**: Nodemailer
- **Session Management**: express-session
- **Templating**: EJS

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (or MongoDB Atlas for a cloud database)

### Steps to Setup

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/portfolio-platform.git
   cd portfolio-platform
