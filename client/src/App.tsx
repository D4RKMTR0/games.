import { createBrowserRouter, RouterProvider } from 'react-router';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Library from './pages/Library';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Log from './pages/Log';
import Auth from './pages/Auth';
import Settings from './pages/Settings';

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
        element: <div className="p-10 font-mono text-xs">BOOTING_MODULE...</div>,
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
        path: "user/settings",
        element: <Settings />
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