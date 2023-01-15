# Description
Express Postgresql backend for face detector app. Hosted with Docker + railway.app. Functionality:
1. API Authentication
2. User sign up
3. User sign in
4. Password encryptions
5. Face detection using Clarafai API

# Database schema
![Database ER diagram (crow's foot)](https://user-images.githubusercontent.com/52435643/154823318-964e916e-c7a9-4d86-94f5-2ce759901619.png)

# How to run ?
1. Clone this repo
2. Sign up with Clarifai https://clarifai.com/ to get API key for face detection
3. Create .env with the Clarifai API key. See .env.example
4. Yarn install
5. Yarn start
