import { render } from 'preact'
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { AuthProvider } from "./auth/state.jsx";
import { RenderedRoutes } from "./routes.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./utils/i18n.js";
import "./main.css"

render(
  <Router>
    <GeistProvider>
      <CssBaseline />
      <AuthProvider>
        <RenderedRoutes />
      </AuthProvider>
    </GeistProvider>
  </Router>,
  document.getElementById('app'))
