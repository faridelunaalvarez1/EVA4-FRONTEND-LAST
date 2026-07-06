import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getMe, getUser, saveSession } from "../services/authService";
import { updateUser } from "../services/userService";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const PerfilPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    birth_date: "",
    sport: ""
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    try {
      const response = await getMe();
      const user = response.data || response;

      setUserId(user.id);
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        birth_date: user.birth_date ? user.birth_date.substring(0, 10) : "",
        sport: user.metadata && user.metadata.sports && user.metadata.sports[0]
          ? user.metadata.sports[0].name
          : ""
      });
    } catch (err) {
      Swal.fire("Error", "No se pudo cargar el perfil. Intenta recargar la pagina.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!formData.full_name || formData.full_name.trim().length < 3 || formData.full_name.trim().length > 100) {
      nuevosErrores.full_name = "El nombre debe tener entre 3 y 100 caracteres";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      nuevosErrores.email = "Ingresa un correo valido";
    }

    if (!formData.birth_date) {
      nuevosErrores.birth_date = "La fecha de nacimiento es obligatoria";
    }

    if (passwordData.password || passwordData.confirmPassword) {
      if (!PASSWORD_REGEX.test(passwordData.password)) {
        nuevosErrores.password = "Minimo 8 caracteres, con al menos una letra y un numero";
      }
      if (passwordData.password !== passwordData.confirmPassword) {
        nuevosErrores.confirmPassword = "Las contrasenas no coinciden";
      }
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        birth_date: formData.birth_date,
        metadata: {
          sports: formData.sport.trim() ? [{ name: formData.sport.trim() }] : []
        }
      };

      if (passwordData.password) {
        payload.password = passwordData.password;
      }

      const actualizado = await updateUser(userId, payload);

      const userActualizado = actualizado.data || actualizado;
      const currentUser = getUser();
      saveSession(localStorage.getItem("token"), { ...currentUser, ...userActualizado });

      setPasswordData({ password: "", confirmPassword: "" });

      Swal.fire("Listo", "Tu perfil se actualizo correctamente", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo actualizar el perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Cargando perfil...</div>;
  }

  return (
    <div>
      <h3 className="fw-bold mb-4">Mi Perfil</h3>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            name="full_name"
            className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
            value={formData.full_name}
            onChange={handleChange}
          />
          {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electronico</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de nacimiento</label>
          <input
            type="date"
            name="birth_date"
            className={`form-control ${errors.birth_date ? "is-invalid" : ""}`}
            value={formData.birth_date}
            onChange={handleChange}
          />
          {errors.birth_date && <div className="invalid-feedback">{errors.birth_date}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Deporte de interes</label>
          <input
            type="text"
            name="sport"
            className="form-control"
            value={formData.sport}
            onChange={handleChange}
          />
        </div>

        <hr className="my-4" />
        <h5 className="mb-3">Cambiar contrasena</h5>
        <p className="text-muted small">Deja estos campos vacios si no quieres cambiarla</p>

        <div className="mb-3">
          <label className="form-label">Nueva contrasena</label>
          <input
            type="password"
            name="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            value={passwordData.password}
            onChange={handlePasswordChange}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="mb-4">
          <label className="form-label">Repetir contrasena</label>
          <input
            type="password"
            name="confirmPassword"
            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
};

export default PerfilPage;
