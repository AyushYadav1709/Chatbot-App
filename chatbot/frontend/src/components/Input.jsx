export default function Input({
  label,
  type,
  name,
  id,
  placeholder,
  ...props
}) {
  return (
    <label className="flex items-center justify-between mt-4 mb-4 text-brown md:flex-row">
      <span className="text-xl mb-2 md:mb-0 md:mr-4">{label}</span>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        {...props}
        className="p-3 rounded-lg bg-gray-300 shadow-2xl transition duration-300 text-brown w-80 disabled:opacity-50 disabled:text-gray-500"
      />
    </label>
  );
}
