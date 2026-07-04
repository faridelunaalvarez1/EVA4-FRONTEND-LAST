import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import { loginUser, saveSession } from "../services/authService";
import logo from "../assets/logo_empresa_letra_v1.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      saveSession(data.data.token, data.data.user);
      if (data.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.data.user.role === "coach") {
        navigate("/coach/dashboard");
      } else {
        navigate("/user/dashboard");
      }
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
            <h1 className="display-5 fw-bold mb-3">Tu mejor versión comienza hoy</h1>
            <p className="lead">En SportClub no solo vienes a entrenar... vienes a crecer, a superarte y a construir tu mejor versión.</p>
          </div>
          <div className="col-lg-5 ms-auto">
            <Card className="shadow border-0 rounded-4">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-3">
                  <img src={logo} alt="SportClub" height="60" />
                </div>
                <h2 className="text-center fw-bold mb-4" style={{ color: "#2E1A47" }}>Login</h2>
                {error && <Alert variant="danger" className="py-2 text-center">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Email:</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ingrese su correo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Contraseña:</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                        <><Spinner size="sm" animation="border" className="me-2" />Ingresando...</>
                      ) : "Iniciar Sesión"}
                    </Button>
                  </div>
                  <hr />
                  <div className="text-center mt-3">
                    <a href="/register" className="text-decoration-none" style={{ color: "#2E1A47" }}>
                      ¿No tienes cuenta? Registrarse
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

export default Login;