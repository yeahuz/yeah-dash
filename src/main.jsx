import { render } from 'preact'
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { AuthProvider } from "./auth/state.jsx";
import { RenderedRoutes } from "./routes.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./utils/i18n.js";
import "./main.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

render(
  <Router>
    <GeistProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RenderedRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </GeistProvider>
  </Router>,
  document.getElementById('app'))
