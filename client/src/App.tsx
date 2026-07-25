import { createBrowserRouter, RouterProvider } from 'react-router';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Library from './pages/Library';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Log from './pages/Log';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import GamePage from './pages/GamePage';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "library",
        element: <Library />,
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "log",
        element: <Log />
      },
      {
        path: "game/:id",
        element: <GamePage /> 
      },
      {
        path: "auth/signup",
        element: <Auth />
      },
      {
        path: "auth/login",
        element: <Auth />
      },
      {
        path: "auth/forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "auth/reset-password",
        element: <ResetPassword />
      },
      {
        path: "user/settings",
        element: <Settings />
      },
      {
        path: "user/:username",
        element: <UserProfile />
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App