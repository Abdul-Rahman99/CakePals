# Cake Pals

This repository contains a comprehensive Baking products API built with Node.js, designed to power an online store backend. It offers a wide range of features and functionalities to support food application development.
Repository Name: Ecommerce API using Node.js

# Task Description:
CakePals is an app where people can sell home-baked cakes and pies to each other. There are Bakers
who can register on CakePals and list their products for sale. App users typically look for available
offerings nearby, create a member account (if needed) and place a baking order. Bakers receive orders,
bake and hand over ready products at the agreed collection time. Refer to the Appendix for an example.

# The Solution:
Focused on Backend only with node.js

# Functionalities through API:

This repository contains a comprehensive Baking site API built with Node.js, designed to power an online store backend. It offers a wide range of features and functionalities to support your products selling application development like: 
  1- New account registration (either as a Member or as a Baker).
  2- Bakers and Members can authenticate.
  3- Bakers can add new products for selling and then edit or remove them.
  4- All users can list available products and filter them by location and type.
  5- All users can see a baker’s profile (with a rating).
  6- Members can see available collection times and place orders. For collection time availability, assume that each baker can bake only one       cake at a time (see an example in the Appendix).
  7- Bakers can see their orders, accept, reject and fulfil them.
  8- Customers can rate their fulfilled orders. Orders rates form the overall baker’s rating.
  9- All Registered users (Baker or Member) can update thier and reset thier passwords.

# Technologies: (Nodejs, Expressjs, MongoDB, Mongoose)
Express Server: The API is built using the popular Express.js framework, providing a robust and scalable foundation for handling HTTP requests and building APIs.

MongoDB: The API integrates with MongoDB, a flexible and scalable NoSQL database, allowing you to efficiently store and retrieve data related to your ecommerce platform.

CRUD Operations: The API provides full support for Create, Read, Update, and Delete operations across all sections of your ecommerce application, ensuring seamless management of products, categories, orders, and more.

Advanced Error Handling: Robust error handling mechanisms are implemented, ensuring graceful handling of errors and providing informative error messages for easier debugging.

Image Upload and Processing: The API includes functionality to upload product images and perform image processing tasks such as resizing and optimization, enhancing the visual experience of your ecommerce platform.

Authentication and Authorization: Secure user authentication and authorization mechanisms are implemented, allowing for protected access to specific resources and ensuring that only authorized users can perform certain actions.

Reviews: The API supports user reviews and ratings for products and bakers, enabling customers to share their feedback and experiences with the community.

Security: Robust security measures are implemented to protect sensitive user data, prevent unauthorized access, and ensure the integrity of your ecommerce platform.

# Technical descisions:

compression is a separate service to make the api more fater and usable.
Add the right attributes shown in models to the API to get your right results.
Add extra attributes(Juices, Online payment, City, Country) to the models to make it more usable if we want to add more functionalities in the future.
Express, is a very lightweight framework.
MongoDB one of the most famous document database.
startOrderAvailabilityCheck is a function to update the bakers availability every 10 min.


# Clone the repository: git clone https://github.com/Abdul-Rahman99/CakePals.git

Navigate to the project directory: cd CakePals
Install the dependencies: npm install 
Configure the MongoDB connection in the config.js file. 
Start the server: npm start:dev
Access the app at http://localhost:1111

# Run App (For Production) https://cakepals-4dtl.onrender.com

U can use this link to start deploying the api on your machine 
https://cakepals-4dtl.onrender.com/

# Contributing:

Contributions to the Node.js CakePals App are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request on GitHub.

# License:
This project is licensed under the MIT License. Feel free to use and modify the code for personal or commercial purposes.

# Summary
Whether you're building a small online baking store to sell your products for customers, this API provides a solid foundation, enabling you to focus on developing the frontend and delivering an exceptional shopping experience for your customers.

# Prerequisites

- Node.js version: "^18.17.0".
