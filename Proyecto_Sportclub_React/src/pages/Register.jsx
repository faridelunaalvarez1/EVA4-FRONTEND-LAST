import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import logo from "../assets/logo_empresa_letra_v1.png";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "El nombre es obligatorio.";
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = "El nombre debe tener al menos 2 caracteres.";
    } else if (formData.full_name.trim().length > 50) {
      newErrors.full_name = "El nombre no puede superar los 50 caracteres.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(formData.full_name.trim())) {
      newErrors.full_name = "El nombre solo puede contener letras y espacios.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = "Ingrese un correo válido. Ejemplo: nombre@dominio.cl";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (!/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos una letra.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos un número.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar tu contraseña.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGeneralError("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al registrarse");

      navigate("/login");
    } catch (err) {
      setGeneralError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#2E1A47", minHeight: "100vh" }} className="d-flex align-items-center">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 text-white">
            <h1 className="display-5 fw-bold mb-3">Únete a SportClub</h1>
            <p className="lead">Crea tu cuenta y comienza tu camino hacia la mejor versión de ti mismo.</p>
          </div>
          <div className="col-lg-5 ms-auto">
            <Card className="shadow border-0 rounded-4">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-3">
                  <img src={logo} alt="SportClub" height="60" />
                </div>
                <h2 className="text-center fw-bold mb-4" style={{ color: "#2E1A47" }}>Registro</h2>
                {generalError && <Alert variant="danger" className="py-2 text-center">{generalError}</Alert>}
                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Nombre completo:</Form.Label>
                    <Form.Control
                      name="full_name"
                      placeholder="Ingrese su nombre"
                      value={formData.full_name}
                      onChange={handleChange}
                      isInvalid={!!errors.full_name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.full_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Email:</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Ingrese su correo"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Contraseña:</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Mínimo 8 caracteres con letras y números"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Confirmar contraseña:</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Repita su contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
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
                      ) : "Crear cuenta"}
                    </Button>
                  </div>
                  <hr />
                  <div className="text-center mt-3">
                    <a href="/login" className="text-decoration-none" style={{ color: "#2E1A47" }}>
                      ¿Ya tienes cuenta? Iniciar sesión
                    </a>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;