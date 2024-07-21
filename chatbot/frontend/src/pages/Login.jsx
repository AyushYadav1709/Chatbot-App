import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { PulseSpinner } from "react-spinners-kit";
import { toast } from "react-toastify";

import Input from "../components/Input";

export default function Login() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <div className="flex justify-center items-center m-0 h-screen">
        <Form
          method="POST"
          className="p-4 md:p-16 bg-stone-300 rounded-2xl shadow-2xl text-center w-full md:w-auto"
        >
          <h2 className="text-center mb-8 text-5xl font-black text-brown">
            Login
          </h2>
          {data && data.message && (
            <p className="text-red text-xl py-2">{data.message}</p>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
          />

          <div className="flex flex-col md:flex-row justify-end gap-2 mt-8">
            <button
              type="submit"
              className="py-2 px-4 text-lg text-cream rounded-md bg-brown cursor-pointer transition-all hover:bg-beige hover:text-cream focus:bg-gray focus:outline-none disabled:opacity-50 disabled:bg-brown disabled:text-gray-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <PulseSpinner size={30} color="#EEEEEE" />
              ) : (
                "Login"
              )}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: " Could not authenticate." }, { status: 500 });
  }

  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem("token", token);

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem("expire", expiration.toISOString());

  const firstName = resData.firstName;
  localStorage.setItem("name", firstName);

  toast.success("Login successful.", {
    position: "top-center",
  });
  return redirect("/");
}
