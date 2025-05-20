# Event Ticketing System - Frontend

This is the frontend application for the Event Ticketing System, built with React, TypeScript, and Material-UI.

## Features

- User authentication (login, register, forgot password)
- Event browsing and searching
- Event booking and management
- User profile management
- Admin dashboard for user and event management
- Responsive design for all devices
- Real-time notifications
- Interactive charts and analytics

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_NAME=Event Ticketing System
   ```

## Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be available in the `build` directory.

## Project Structure

```
src/
├── components/     # Reusable components
│   ├── shared/    # Shared components (Navbar, Footer, etc.)
│   └── events/    # Event-related components
├── contexts/      # React contexts
├── pages/         # Page components
│   ├── admin/     # Admin pages
│   ├── auth/      # Authentication pages
│   ├── events/    # Event pages
│   ├── organizer/ # Organizer pages
│   └── profile/   # Profile pages
├── utils/         # Utility functions and helpers
├── App.tsx        # Main application component
└── index.tsx      # Application entry point
```

## Available Scripts

- `npm start` - Starts the development server
- `npm test` - Runs tests
- `npm run build` - Creates a production build
- `npm run eject` - Ejects from Create React App

## Dependencies

- React
- TypeScript
- Material-UI
- React Router
- Axios
- React Toastify
- Recharts
- Date-fns

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
