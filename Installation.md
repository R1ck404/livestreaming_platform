# Installation Guide
This installation guide is not a comprehensive guide for setting up a development environment. It is intended to provide a quick guide to get the project up and running on your local machine.

## Prerequisites

- **Node.js** (version 14.x or later)
- **npm** (Node Package Manager, comes with Node.js)
- **PocketBase** (for the database, a lightweight database)

---

## Installation Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/R1ck404/livestreaming_platform
    cd livestreaming_platform
    ```

2. **Install Dependencies**:

    - Navigate to the `backend` folder and install dependencies:
      ```bash
      cd backend
      npm install
      ```

    - Navigate to the `frontend` folder and install dependencies:
      ```bash
      cd ../frontend
      npm install
      ```

3. **Configure Environment Variables**:

    - You need to create and configure `.env` files in both the `backend` and `frontend` folders. These files should contain the same environment variables. Create or modify the `.env` file in each folder:
      ```env
      # Example content for .env file
      NEXT_PUBLIC_POCKETBASE_API_URL="http://127.0.0.1:8090"
      NEXT_PUBLIC_NMS_API_URL="http://127.0.1:8000"
      JWT_SECRET="YOUR_SECURE_JWT_SECRET"
      RATE_LIMIT_TOKEN="test"
      POCKETBASE_ADMIN_EMAIL="YOUR_ADMIN_EMAIL"
      POCKETBASE_ADMIN_PASSWORD="YOUR_ADMIN_PASSWORD"
      ```

    **Ensure the values are identical in both `backend` and `frontend` `.env` files**.

4. **Start the Database**:

    - Navigate to the `database` folder and run PocketBase:
      ```bash
      cd ../database
      ./pocketbase serve
      ```

5. **Start the Backend Server**:

    - Navigate back to the `backend` folder and start the server:
      ```bash
      cd ../backend
      npm run start
      ```

6. **Start the Frontend Application**:

    - Finally, navigate to the `frontend` folder and start the client:
      ```bash
      cd ../frontend
      npm run start
      ```

7. **Access the Application**:

    - Open your browser and navigate to `http://localhost:3000` to access the livestreaming application.

---

## Summary

1. `cd backend && npm install`
2. `cd frontend && npm install`
3. Configure `.env` files in both `backend` and `frontend` (values must be identical).
4. `cd database && ./pocketbase serve`
5. `cd backend && npm run start`
6. `cd frontend && npm run start`

---

## Troubleshooting

- **Ensure identical `.env` files**: Any discrepancy can cause issues with the communication between the backend and frontend.
- **Database issues**: Ensure PocketBase is running properly on `http://localhost:8090`.

---

Thank you for using our Livestreaming Project! If you encounter any issues, please feel free to open an issue on the repository.

Happy streaming! 🚀