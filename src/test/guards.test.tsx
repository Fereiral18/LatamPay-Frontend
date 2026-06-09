import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PrivateRoute } from "../routes/guards/PrivateRoute";
import { PublicRoute } from "../routes/guards/PublicRoute";
import type { AuthContextValue } from "../context/AuthContext";

// Mock de useAuth: cada test lo ajusta a su escenario --------------------------

const useAuthMock = vi.fn();

vi.mock("../context/AuthContext", async () => {
  const actual = await vi.importActual<
    typeof import("../context/AuthContext")
  >("../context/AuthContext");
  return {
    ...actual,
    useAuth: () => useAuthMock(),
  };
});

const buildAuth = (overrides: Partial<AuthContextValue>): AuthContextValue => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  verifyPassword: vi.fn(),
  ...overrides,
});

beforeEach(() => {
  useAuthMock.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

// PrivateRoute ---------------------------------------------------------------

describe("PrivateRoute", () => {
  const renderAt = (initialPath: string) =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route
              path="/dashboard"
              element={<div data-testid="dashboard">Dashboard</div>}
            />
          </Route>
          <Route path="/login" element={<div data-testid="login">Login</div>} />
        </Routes>
      </MemoryRouter>,
    );

  it("renderiza el Outlet si el usuario está autenticado", () => {
    useAuthMock.mockReturnValue(
      buildAuth({ isAuthenticated: true, token: "jwt" }),
    );
    renderAt("/dashboard");
    expect(screen.getByTestId("dashboard")).toBeTruthy();
    expect(screen.queryByTestId("login")).toBeNull();
  });

  it("redirige a /login si el usuario NO está autenticado", () => {
    useAuthMock.mockReturnValue(buildAuth({ isAuthenticated: false }));
    renderAt("/dashboard");
    expect(screen.getByTestId("login")).toBeTruthy();
    expect(screen.queryByTestId("dashboard")).toBeNull();
  });

  it("renderiza null mientras isLoading=true (no redirige ni muestra contenido)", () => {
    useAuthMock.mockReturnValue(
      buildAuth({ isAuthenticated: false, isLoading: true }),
    );
    const { container } = renderAt("/dashboard");
    expect(screen.queryByTestId("dashboard")).toBeNull();
    expect(screen.queryByTestId("login")).toBeNull();
    expect(container.innerHTML).toBe("");
  });
});

// PublicRoute ----------------------------------------------------------------

describe("PublicRoute", () => {
  const renderAt = (initialPath: string) =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<div data-testid="login">Login</div>} />
          </Route>
          <Route
            path="/dashboard"
            element={<div data-testid="dashboard">Dashboard</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

  it("renderiza el Outlet si el usuario NO está autenticado", () => {
    useAuthMock.mockReturnValue(buildAuth({ isAuthenticated: false }));
    renderAt("/login");
    expect(screen.getByTestId("login")).toBeTruthy();
    expect(screen.queryByTestId("dashboard")).toBeNull();
  });

  it("redirige a /dashboard si el usuario está autenticado", () => {
    useAuthMock.mockReturnValue(
      buildAuth({ isAuthenticated: true, token: "jwt" }),
    );
    renderAt("/login");
    expect(screen.getByTestId("dashboard")).toBeTruthy();
    expect(screen.queryByTestId("login")).toBeNull();
  });

  it("renderiza null mientras isLoading=true", () => {
    useAuthMock.mockReturnValue(
      buildAuth({ isAuthenticated: true, isLoading: true }),
    );
    const { container } = renderAt("/login");
    expect(screen.queryByTestId("login")).toBeNull();
    expect(screen.queryByTestId("dashboard")).toBeNull();
    expect(container.innerHTML).toBe("");
  });
});
