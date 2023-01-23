import { render } from 'preact'
import { AuthProvider } from "./auth/state.jsx";
import { RenderedRoutes } from "./routes.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./utils/i18n.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EuiProvider } from "@elastic/eui";
import "@elastic/eui/dist/eui_theme_light.min.css"
import "./main.css"
import "./core/icons.js";


const queryClient = new QueryClient();

render(
  <Router>
    <EuiProvider colorMode="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RenderedRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </EuiProvider>
  </Router>,
  document.getElementById('app'))
