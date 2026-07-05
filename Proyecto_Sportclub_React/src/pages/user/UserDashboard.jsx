<Route 
          path="/user/*" 
          element={
            <RoleRoute allowedRoles={["user"]}>
              <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="clases-disponibles" element={<ClasesDisponiblesPage />} />
              </Routes>
            </RoleRoute>
          } 
        />