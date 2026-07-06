import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getMe, getUser, saveSession } from "../services/authService";
import { updateUser } from "../services/userService";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const getRoleColor = (role) => {
  if (role === "admin") return "#a12a2a";
  if (role === "coach") return "#1a7a4c";
  return "#1e5aa8";
};

const getIniciales = (nombre) => {
  if (!nombre) return "?";
  const partes = nombre.trim().split(/\s+/);
  const primera = partes[0] ? partes[0][0] : "";
  const segunda = partes[1] ? partes[1][0] : "";
  return (primera + segunda).toUpperCase();
};

const formatFecha = (fecha) => {
  if (!fecha) return "-";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-CL");
};

const PerfilPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("user");
  const [createdAt, setCreatedAt] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    birth_date: "",
    sport: "",
    otros: ""
  });

  const [backupData, setBackupData] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState(false);

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    try {
      const response = await getMe();
      const user = response.data || response;

      setUserId(user.id);
      setRole(user.role || "user");
      setCreatedAt(user.created_at || null);

      const datos = {
        full_name: user.full_name || "",
        email: user.email || "",
        birth_date: user.birth_date ? user.birth_date.substring(0, 10) : "",
        sport: user.metadata && user.metadata.sports && user.metadata.sports[0]
          ? user.metadata.sports[0].name
          : "",
        otros: user.metadata && user.metadata.otros ? user.metadata.otros : ""
      };

      setFormData(datos);
      setBackupData(datos);
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

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const validarPassword = () => {
    const nuevosErrores = {};

    if (!PASSWORD_REGEX.test(passwordData.password)) {
      nuevosErrores.password = "Minimo 8 caracteres, con al menos una letra y un numero";
    }
    if (passwordData.password !== passwordData.confirmPassword) {
      nuevosErrores.confirmPassword = "Las contrasenas no coinciden";
    }
    if (!passwordData.currentPassword) {
      nuevosErrores.currentPassword = "Ingresa tu contrasena actual";
    }

    setPasswordErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleCancelar = () => {
    setFormData(backupData);
    setErrors({});
    setIsEditing(false);
  };

  const handleGuardar = async () => {
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
          sports: formData.sport.trim() ? [{ name: formData.sport.trim() }] : [],
          otros: formData.otros.trim()
        }
      };

      const actualizado = await updateUser(userId, payload);
      const userActualizado = actualizado.data || actualizado;
      const currentUser = getUser();
      saveSession(localStorage.getItem("token"), { ...currentUser, ...userActualizado });

      setBackupData(formData);
      setIsEditing(false);

      Swal.fire("Listo", "Tu perfil se actualizo correctamente", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo actualizar el perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleActualizarPassword = async () => {
    if (!validarPassword()) {
      return;
    }

    setSavingPassword(true);
    try {
      await updateUser(userId, { password: passwordData.password });

      setPasswordData({ currentPassword: "", password: "", confirmPassword: "" });
      setPasswordErrors({});

      Swal.fire("Listo", "Tu contrasena se actualizo correctamente", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo actualizar la contrasena", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Cargando perfil...</div>;
  }

  const colorRol = getRoleColor(role);

  return (
    <div>
      <div className="small text-muted mb-2">Inicio &gt; Perfil</div>

      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="fw-bold mb-1">Mi Perfil</h3>
          <div className="text-muted">Gestiona tu informacion personal y preferencias de cuenta.</div>
        </div>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Editar Perfil
          </button>
        )}
      </div>

      <div className="row g-4">
        {/* Columna izquierda: tarjeta de avatar */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "96px",
                  height: "96px",
                  backgroundColor: colorRol,
                  color: "#fff",
                  fontSize: "1.75rem",
                  fontWeight: "bold"
                }}
              >
                {getIniciales(formData.full_name)}
              </div>
              <h5 className="fw-bold mb-0">{formData.full_name || "Sin nombre"}</h5>
              <div className="text-muted small mb-2">Usuario del Sistema</div>
              <span
                className="badge mb-3"
                style={{ backgroundColor: colorRol, textTransform: "uppercase" }}
              >
                {role}
              </span>

              <ul className="list-unstyled text-start mt-3">
                <li className="mb-3">
                  <div className="text-muted small">Email</div>
                  <div>{formData.email}</div>
                </li>
                <li className="mb-3">
                  <div className="text-muted small">Fecha de nacimiento</div>
                  <div>{formatFecha(formData.birth_date)}</div>
                </li>
                <li className="mb-3">
                  <div className="text-muted small">Rol</div>
                  <div className="text-capitalize">{role}</div>
                </li>
                {createdAt && (
                  <li className="mb-0">
                    <div className="text-muted small">Fecha de registro</div>
                    <div>{formatFecha(createdAt)}</div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Columna derecha: informacion personal + contrasena */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Informacion Personal</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre completo *</label>
                  <input
                    type="text"
                    name="full_name"
                    className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Fecha de nacimiento *</label>
                  <input
                    type="date"
                    name="birth_date"
                    className={`form-control ${errors.birth_date ? "is-invalid" : ""}`}
                    value={formData.birth_date}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {errors.birth_date && <div className="invalid-feedback">{errors.birth_date}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Deporte favorito</label>
                  <input
                    type="text"
                    name="sport"
                    className="form-control"
                    value={formData.sport}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Otros / Metadata (intereses, habilidades, etc.)</label>
                  <textarea
                    name="otros"
                    className="form-control"
                    rows="2"
                    value={formData.otros}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button className="btn btn-outline-secondary" onClick={handleCancelar} disabled={saving}>
                    Cancelar
                  </button>
                  <button className="btn btn-success" onClick={handleGuardar} disabled={saving}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Cambiar Contrasena</h5>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Contrasena actual *</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    name="currentPassword"
                    className={`form-control ${passwordErrors.currentPassword ? "is-invalid" : ""}`}
                    placeholder="Ingresa tu contrasena actual"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  {passwordErrors.currentPassword && (
                    <div className="invalid-feedback">{passwordErrors.currentPassword}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Nueva contrasena *</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    name="password"
                    className={`form-control ${passwordErrors.password ? "is-invalid" : ""}`}
                    placeholder="Minimo 8 caracteres"
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                  />
                  {passwordErrors.password && (
                    <div className="invalid-feedback">{passwordErrors.password}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Confirmar nueva contrasena *</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    name="confirmPassword"
                    className={`form-control ${passwordErrors.confirmPassword ? "is-invalid" : ""}`}
                    placeholder="Repite tu nueva contrasena"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  {passwordErrors.confirmPassword && (
                    <div className="invalid-feedback">{passwordErrors.confirmPassword}</div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="mostrarPasswords"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                  />
                  <label className="form-check-label small text-muted" htmlFor="mostrarPasswords">
                    Mostrar contrasenas
                  </label>
                </div>

                <button
                  className="btn btn-warning fw-bold"
                  onClick={handleActualizarPassword}
                  disabled={savingPassword}
                >
                  {savingPassword ? "Actualizando..." : "Actualizar contrasena"}
                </button>
              </div>

              <div className="text-muted small mt-2">
                La contrasena debe tener al menos 8 caracteres, incluir numeros y letras.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
