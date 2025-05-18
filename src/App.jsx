import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./RootLayout";
import { createBrowserRouter, RouterProvider } from "react-router";
import Contact from "./pages/Contact";
import firebaseConfig from "./pages/firebase.config";
import Udpate from "./pages/Udpate";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: RootLayout,
      errorElement:<ErrorPage/>,
      children: [
        {
          index: true,
          Component: Home,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        }
      ],
    },
    {
      path:"/edit",
      element:<Udpate/>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
