// src/components/ui/PasswordToggle.jsx
import { useState } from "react";

export default function PasswordToggle({ name, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-[#CCE7E3] rounded-lg"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        aria-label="toggle password"
      >
        {show ? "🙉" : "🙈"}
      </button>
    </div>
  );
}
