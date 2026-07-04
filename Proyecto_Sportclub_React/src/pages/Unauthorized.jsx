import React from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Container } from "react-bootstrap";

function Unauthorized() {
  return (
    <Container className="mt-5">
      <Alert variant="danger" className="text-center shadow-sm">
        <Alert.Heading>Acceso No Autorizado</Alert.Heading>
        <p>
          No tienes los permisos necesarios para ingresar a esta sección del sistema.
        </p>
        <hr />
        <div className="d-flex justify-content-center">
          <Link to="/login">
            <Button variant="danger">Volver al inicio de sesión</Button>
          </Link>
        </div>
      </Alert>
    </Container>
  );
}

export default Unauthorized;