import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "", role: "user" });
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
      await Swal.fire("Registro exitoso", "Ahora puedes iniciar sesion.", "success");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#e9ecef" }}
    >
      <Card style={{ width: "26rem" }} className="p-4 shadow-lg rounded-4">
        <Card.Body>
          <h2 className="text-center fw-bold mb-4">Crear Cuenta</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Nombre completo"
                required
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Correo electronico"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Contrasena"
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 fw-bold" disabled={loading}>
              {loading ? "Cargando..." : "Registrarse"}
            </Button>
          </Form>

          <div className="mt-4 text-center">
            <Link to="/login" className="fw-semibold">
              Ya tienes cuenta? Inicia sesion aqui
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
