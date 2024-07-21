import { Form, NavLink, useRouteLoaderData } from "react-router-dom";

export default function MainNavigation() {
  const token = useRouteLoaderData("root");

  return (
    <>
      <header className="fixed w-full flex justify-between p-4 bg-stone-300">
        <div>
          <NavLink to="/">
            <h2 className="text-3xl text-brown font-bold">Chat-Bot</h2>
          </NavLink>
        </div>

        <div className="flex gap-5">
          {!token && (
            <>
              <div>
                <button className="py-2 px-4 text-xl rounded-md bg-transparent text-stone-900 hover:text-beige">
                  <NavLink to="/login">Login</NavLink>
                </button>
              </div>
              <div>
                <button className="py-2 px-4 text-xl rounded-md bg-stone-900 text-cream cursor-pointer transition-all hover:bg-beige hover:text-cream focus:bg-beige focus:outline-none">
                  <NavLink to="/signup">Signup</NavLink>
                </button>
              </div>
            </>
          )}

          {token && (
            <>
              <div>
                <p className="py-2 px-4 text-xl rounded-md bg-transparent text-brown ">
                  Hello, {localStorage.getItem("name")}
                </p>
              </div>
              <Form action="logout" method="POST">
                <button className="py-2 px-4 text-xl rounded-md bg-brown text-cream cursor-pointer transition-all hover:bg-beige hover:text-cream focus:bg-beige focus:outline-none">
                  Logout
                </button>
              </Form>
            </>
          )}
        </div>
      </header>
    </>
  );
}
