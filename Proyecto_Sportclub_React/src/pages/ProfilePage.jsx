import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col, Badge } from "react-bootstrap";
import { getMe, saveSession, getToken } from "../services/authService";
import { updateUser } from "../services/userService";
import Swal from "sweetalert2";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const roleColors = { admin: "danger", coach: "success", user: "primary" };
const roleLabels = { admin: "Administrador", coach: "Entrenador", user: "Usuario del Sistema" };

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", email: "", birth_date: "", sport: "" });
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });

  const cargarPerfil = async () => {
    setLoading(true);
    try {
      const res = await getMe();
      const u = res.data || res;
      setUser(u);
      let sportsArray = [];
      if (u.metadata) {
        const meta = typeof u.metadata === "string" ? JSON.parse(u.metadata) : u.metadata;
        sportsArray = meta.sports || [];
      }
      setFormData({
        full_name: u.full_name || "",
        email: u.email || "",
        birth_date: u.birth_date ? u.birth_date.substring(0, 10) : "",
        sport: sportsArray.length > 0 ? sportsArray[0].name : ""
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar tu perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarPerfil(); }, []);

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    if (formData.full_name.trim().length < 3 || formData.full_name.trim().length > 100) {
      Swal.fire("Error", "El nombre debe tener entre 3 y 100 caracteres", "error");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      Swal.fire("Error", "Ingresa un correo valido", "error");
      return;
    }
    if (!formData.birth_date) {
      Swal.fire("Error", "La fecha de nacimiento es obligatoria", "error");
      return;
    }
    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        birth_date: formData.birth_date,
        metadata: { sports: formData.sport ? [{ name: formData.sport.trim() }] : [] }
      };
      await updateUser(user.id, payload);
      const updatedUser = { ...user, ...payload };
      saveSession(getToken(), updatedUser);
      setUser(updatedUser);
      setEditing(false);
      Swal.fire("Listo", "Tu perfil se actualizo correctamente", "success");
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo guardar el cambio", "error");
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!passwordRegex.test(passwordData.newPassword)) {
      Swal.fire("Error", "La contrasena debe tener minimo 8 caracteres, incluyendo letras y numeros", "error");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire("Error", "Las contrasenas no coinciden", "error");
      return;
    }
    try {
      await updateUser(user.id, { password: passwordData.newPassword });
      setPasswordData({ newPassword: "", confirmPassword: "" });
      Swal.fire("Listo", "Tu contrasena se actualizo correctamente", "success");
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo actualizar la contrasena", "error");
    }
  };

  if (loading) return <Container className="py-5 text-center">Cargando perfil...</Container>;
  if (!user) return <Container className="py-5 text-center">No se pudo cargar el perfil.</Container>;

  return (
    <Container className="py-4">
      <h2 className="fw-bold mb-4">Mi Perfil</h2>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <div className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: "90px", height: "90px", fontSize: "2rem" }}>
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
              </div>
              <h5 className="fw-bold mb-1">{user.full_name}</h5>
              <Badge bg={roleColors[user.role] || "secondary"} className="mb-3">{roleLabels[user.role] || user.role}</Badge>
              <div className="text-start small text-muted mt-3">
                <p className="mb-2"><strong>Email:</strong><br />{user.email}</p>
                <p className="mb-2"><strong>Fecha de nacimiento:</strong><br />{formData.birth_date || "No registrada"}</p>
                <p className="mb-0"><strong>Rol:</strong><br />{roleLabels[user.role] || user.role}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0">Informacion Personal</h5>
                {!editing && <Button size="sm" variant="outline-primary" onClick={() => setEditing(true)}>Editar Perfil</Button>}
              </div>
              <Form onSubmit={handleSubmitInfo}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">Nombre completo *</Form.Label>
                    <Form.Control disabled={!editing} value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">Email *</Form.Label>
                    <Form.Control disabled={!editing} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">Fecha de nacimiento *</Form.Label>
                    <Form.Control disabled={!editing} type="date" value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">Deporte favorito</Form.Label>
                    <Form.Control disabled={!editing} value={formData.sport} onChange={(e) => setFormData({ ...formData, sport: e.target.value })} placeholder="Ej: Futbol" />
                  </Col>
                </Row>
                {editing && (
                  <div className="d-flex gap-2 justify-content-end mt-3">
                    <Button variant="secondary" onClick={() => { setEditing(false); cargarPerfil(); }}>Cancelar</Button>
                    <Button variant="success" type="submit">Guardar cambios</Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3">Cambiar Contrasena</h5>
              <Form onSubmit={handleSubmitPassword}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">Nueva contrasena *</Form.Label>
                    <Form.Control type="password" placeholder="Minimo 8 caracteres" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-semibold">Confirmar nueva contrasena *</Form.Label>
                    <Form.Control type="password" placeholder="Repite tu nueva contrasena" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                  </Col>
                </Row>
                <small className="text-muted d-block mb-3">La contrasena debe tener al menos 8 caracteres, incluyendo letras y numeros.</small>
                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit">Actualizar contrasena</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
