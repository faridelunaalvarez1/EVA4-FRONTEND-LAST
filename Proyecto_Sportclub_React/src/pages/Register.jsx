import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrarse");
      }
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-96">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Crear Cuenta</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-semibold text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Nombre completo" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Correo electrónico" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Contraseña" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, password: e.target.value})} />
          <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, role: e.target.value})} value={formData.role}>
            <option value="user">Usuario</option>
            <option value="coach">Entrenador</option>
          </select>
          <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all">
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-blue-600 font-semibold hover:underline">¿Ya tienes cuenta? Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;