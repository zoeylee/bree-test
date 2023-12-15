<img width="541" alt="Screenshot 2023-12-14 at 10 14 34 PM" src="https://github.com/zoeylee/bree-test/assets/6045763/d0ba6233-6702-4fb1-ac78-548dbcd83c6e"># Take Home Exercise: Part 1

## Overview

We would like you to create a simple but scalable full stack web application that screens customers against the publicly available OFAC Specially Designated Nationals (SDN) list (url [here](https://ofac.treasury.gov/specially-designated-nationals-list-data-formats-data-schemas)).

## Installation and Setup

**Install dependencies**

```sh
npm install
```

**Run the Application**

**Backend**

The backend located in the `/server` directory. To start the backend server:

```sh
npm run backend
```

**Frontend**

The source files are located in the `/app` directory. To run the frontend application:

```sh
npm run frontend
```

## Project Structure

```sh
├── README.md
├── app                       
│   ├── components
│   │   ├── App.js
│   │   ├── SDNForm.js 
│   │   └── css 
│   │       ├── _App.css
│   │       └── _SDNForm.css
│   ├── config
│   │   └── config.js
│   ├── data     
│   │   └── getCountry.js
│   └── index.js 
├── dist  
│   └── index.html
├── package-lock.json
├── package.json
├── server 
│   ├── Config.js 
│   ├── Server.js
│   ├── endpoints
│   │   └── CheckSDNEndpoint.js
│   ├── utils 
│   │   ├── getPath.js
│   │   └── validateInput.js
│   └── webserver 
│       ├── HTTPServer.js
│       └── Request.js
└── webpack.config.js 
```
## UI  

<img width="541" alt="Screenshot 2023-12-14 at 10 16 12 PM" src="https://github.com/zoeylee/bree-test/assets/6045763/fcb3e27a-b072-4c6e-9950-e6909d714f90">

