import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CreateFormPage() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("forms").insert([
      {
        user_email: formData.email,
        full_name: formData.fullName,
        message: formData.message,
      },
    ]);

    if (error) {
      alert("Error submitting form: " + error.message);
    } else {
      alert("Form submitted successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
      <input
        className="border p-2 w-full"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        className="border p-2 w-full"
        type="text"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      />
      <textarea
        className="border p-2 w-full"
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
