import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import logo from "../assets/logo_empresa_letra_v1.png";

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
    <div style={{ backgroundColor: "#2E1A47", minHeight: "100vh" }} className="d-flex align-items-center">
      <div className="container py-5">
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

                {error && <Alert variant="danger" className="py-2 text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Nombre completo:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese su nombre completo"
                      required
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Email:</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ingrese su correo"
                      required
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Contrasena:</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ingrese su contrasena"
                      required
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
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
