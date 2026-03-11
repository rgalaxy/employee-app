import "./App.css";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import { ToastProvider } from "./components/Toast/toast";
import Header from "./components/Header/header";
import LeftMenu from "./components/LeftMenu/left-menu";
import WizardPage from "./pages/WizardPage";
import EmployeeListPage from "./pages/EmployeeListPage";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);
  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <ToastProvider>
      <RoleProvider>
        <div className="app-layout">
          <Header isMenuOpen={isMenuOpen} onMenuToggle={handleMenuToggle} />
          <div className="app-body">
            <LeftMenu isOpen={isMenuOpen} onClose={handleMenuClose} />
            <main className="app-main">
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/employee-list" replace />}
                />
                <Route path="/wizard" element={<WizardPage />} />
                <Route path="/employee-list" element={<EmployeeListPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </RoleProvider>
    </ToastProvider>
  );
}

export default App;
