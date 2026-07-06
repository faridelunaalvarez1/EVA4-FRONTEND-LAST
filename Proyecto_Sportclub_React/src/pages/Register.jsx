import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import logo from "../assets/logo_empresa_letra_v1.png";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birth_date: "",
    sport_id: "",
    role: "user"
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const validar = () => {
    const nuevosErrores = {};

    if (!formData.full_name.trim()) {
      nuevosErrores.full_name = "El nombre completo es obligatorio.";
    } else if (formData.full_name.length > 100) {
      nuevosErrores.full_name = "El nombre no puede superar los 100 caracteres.";
    } else if (formData.full_name.trim().length < 3) {
      nuevosErrores.full_name = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = "El correo es obligatorio.";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      nuevosErrores.email = "Ingrese un correo valido (ejemplo: nombre@dominio.cl).";
    }

    if (!formData.birth_date) {
      nuevosErrores.birth_date = "La fecha de nacimiento es obligatoria.";
    }

    if (!formData.sport_id.trim()) {
      nuevosErrores.sport_id = "Indique un deporte de interes.";
    }

    if (!formData.password) {
      nuevosErrores.password = "La contrasena es obligatoria.";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      nuevosErrores.password = "Debe tener minimo 8 caracteres, con letras y numeros.";
    }

    if (formData.confirmPassword !== formData.password) {
      nuevosErrores.confirmPassword = "Las contrasenas no coinciden.";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
    if (errors[campo]) {
      setErrors({ ...errors, [campo]: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validar()) return;

    setLoading(true);
    try {
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        birth_date: formData.birth_date,
        metadata: { sports: [{ name: formData.sport_id.trim() }] }
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al registrarse");
      }
      await Swal.fire("Registro exitoso", "Ahora puedes iniciar sesion.", "success");
      navigate("/login");
    } catch (err) {
      setGeneralError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#2E1A47", minHeight: "100vh" }} className="d-flex align-items-center py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 text-white">
            <h1 className="display-5 fw-bold mb-3">Unete a SportClub</h1>
            <p className="lead">Crea tu cuenta y empieza a reservar tus clases favoritas hoy mismo.</p>
          </div>
          <div className="col-lg-5 ms-auto">
            <Card className="shadow border-0 rounded-4">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-3">
                  <img src={logo} alt="SportClub" height="60" />
                </div>
                <h2 className="text-center fw-bold mb-4" style={{ color: "#2E1A47" }}>Crear Cuenta</h2>

                {generalError && <Alert variant="danger" className="py-2 text-center">{generalError}</Alert>}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Nombre completo:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese su nombre completo"
                      value={formData.full_name}
                      isInvalid={!!errors.full_name}
                      onChange={(e) => handleChange("full_name", e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.full_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Email:</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ingrese su correo"
                      value={formData.email}
                      isInvalid={!!errors.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Fecha de nacimiento:</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.birth_date}
                      isInvalid={!!errors.birth_date}
                      onChange={(e) => handleChange("birth_date", e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.birth_date}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Deporte de interes:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej: Yoga, Futbol, Spinning..."
                      value={formData.sport_id}
                      isInvalid={!!errors.sport_id}
                      onChange={(e) => handleChange("sport_id", e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.sport_id}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Contrasena:</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Minimo 8 caracteres, letras y numeros"
                      value={formData.password}
                      isInvalid={!!errors.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Repetir contrasena:</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Repita su contrasena"
                      value={formData.confirmPassword}
                      isInvalid={!!errors.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid mb-3">
                    <Button
                      type="submit"
                      className="fw-bold text-dark border-0"
                      style={{ backgroundColor: "#F2B705" }}
                      disabled={loading}
                    >
                      {loading ? (
                        <><Spinner size="sm" animation="border" className="me-2" />Registrando...</>
                      ) : "Registrarse"}
                    </Button>
                  </div>

                  <hr />

                  <div className="text-center mt-3">
                    <Link to="/login" className="text-decoration-none" style={{ color: "#2E1A47" }}>
                      Ya tienes cuenta? Inicia sesion
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
