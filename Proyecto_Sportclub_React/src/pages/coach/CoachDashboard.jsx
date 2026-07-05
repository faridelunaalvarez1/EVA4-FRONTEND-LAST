{/* Rutas para el Coach */}
        <Route 
          path="/coach/*" 
          element={
            <RoleRoute allowedRoles={["coach"]}>
              <Routes>
                <Route path="dashboard" element={<CoachDashboard />} />
                <Route path="clases" element={<MisClasesPage />} />
              </Routes>
            </RoleRoute>
          } 
        />