import { Form, useActionData, useNavigation, redirect } from "react-router-dom";
import { PulseSpinner } from "react-spinners-kit";
import { toast } from "react-toastify";

import Input from "../components/Input";

export default function Signup() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex justify-center items-center m-0 h-screen">
      <Form
        method="POST"
        className="p-4 md:p-16 bg-stone-300 rounded-2xl shadow-lg text-center w-full md:w-auto"
      >
        <h2 className="text-center mb-8 text-5xl font-black text-brown">
          Signup
        </h2>

        {data && data.message && (
          <p className="text-red text-xl py-2">{data.message}</p>
        )}

        {data && !data.message && (
          <p className="text-red text-xl py-2">{data}</p>
        )}

        <Input
          label="First Name"
          type="text"
          name="firstName"
          id="firstName"
          placeholder="Enter your first name"
        />

        <Input
          label="Last Name"
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Enter your last name"
        />

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

        <Input
          label="Confirm Password"
          type="password"
          name="confirm_password"
          id="confirm_password"
          placeholder="Enter your password again"
        />

        <div className="flex flex-col md:flex-row justify-end gap-4 mt-8">
          <button
            type="reset"
            className="py-2 px-4 text-xl rounded-md bg-transparent text-brown hover:text-beige"
          >
            Reset
          </button>

          <button
            type="submit"
            className="py-2 px-4 text-lg text-cream rounded-md bg-brown cursor-pointer transition-all hover:bg-beige hover:text-cream focus:bg-gray focus:outline-none disabled:opacity-50 disabled:bg-brown disabled:text-gray-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <PulseSpinner size={30} color="#EEEEEE" />
            ) : (
              "Signup"
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    email: data.get("email"),
    password: data.get("password"),
    confirm_password: data.get("confirm_password"),
  };

  if (authData.password !== authData.confirm_password) {
    return "Passwords do not match.";
  }

  const response = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      firstName: authData.firstName,
      lastName: authData.lastName,
      email: authData.email,
      password: authData.password,
    }),
  });

  if (response.status === 422 || response.status === 401) {
    const responseData = await response.json();
    if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
      const errorMessages = responseData.errors.map((error) => error.msg);
      const combinedErrorMessage = errorMessages.join(" ");
      return combinedErrorMessage;
    }
  }

  if (!response.ok) {
    throw json({ message: " Could not authenticate." }, { status: 500 });
  }

  toast.success("Signup successful.", {
    position: "top-center",
  });

  return redirect("/login");
}
