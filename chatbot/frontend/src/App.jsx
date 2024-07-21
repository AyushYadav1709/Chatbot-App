import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout";

import { tokenLoader } from "./util/auth";
import { checkAuthToken } from "./util/auth";
import { action as logoutAction } from "./pages/Logout";
import { action as loginAction } from "./pages/Login";
import { action as signupAction } from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: tokenLoader,
    children: [
      { index: true, element: <ChatPage /> },
      {
        path: "login",
        element: <Login />,
        loader: checkAuthToken,
        action: loginAction,
      },
      {
        path: "signup",
        element: <Signup />,
        loader: checkAuthToken,
        action: signupAction,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
