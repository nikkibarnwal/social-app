# Social App API

This is an Express-based API for a social app. It provides various endpoints to manage users, posts, comments, and likes.

## Features

- User authentication and authorization
- CRUD operations for posts and comments
- Like and unlike functionality for posts
- Follow and unfollow users
- Real-time notifications

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Socket.io for real-time notifications

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/social-app-api.git
    ```
2. Navigate to the project directory:
    ```bash
    cd social-app-api
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root directory and add the following environment variables:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

## Usage

1. Start the server:
    ```bash
    npm start
    ```
2. The API will be available at `http://localhost:5000`.

## API Endpoints

### Auth

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

### Posts

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post by ID
- `DELETE /api/posts/:id` - Delete post by ID

### Comments

- `POST /api/posts/:postId/comments` - Add a comment to a post
- `GET /api/posts/:postId/comments` - Get all comments for a post
- `DELETE /api/posts/:postId/comments/:commentId` - Delete a comment

### Likes

- `POST /api/posts/:postId/like` - Like a post
- `POST /api/posts/:postId/unlike` - Unlike a post

### Follow

- `POST /api/users/:id/follow` - Follow a user
- `POST /api/users/:id/unfollow` - Unfollow a user

## License

This project is licensed under the MIT License.