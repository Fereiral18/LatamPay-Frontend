import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { AuthProvider, useAuth } from "../context/AuthContext";

// Mocks (hoisted) ------------------------------------------------------------

const mocks = vi.hoisted(() => ({
  apiLogin: vi.fn(),
  apiMe: vi.fn(),
  apiRegister: vi.fn(),
  storage: {
    getToken: vi.fn(),
    setToken: vi.fn(),
    clearToken: vi.fn(),
  },
}));

vi.mock("../services/auth.api", () => ({
  apiLogin: mocks.apiLogin,
  apiMe: mocks.apiMe,
  apiRegister: mocks.apiRegister,
}));

vi.mock("../services/authStorage", () => ({
  authStorage: mocks.storage,
}));

// Helpers --------------------------------------------------------------------

const fakeUser = {
  id: "u-1",
  email: "user@example.com",
  role: "user",
  name: "User",
};

const Probe = ({ onReady }: { onReady: (auth: ReturnType<typeof useAuth>) => void }) => {
  const auth = useAuth();
  onReady(auth);
  return (
    <div>
      <span data-testid="loading">{String(auth.isLoading)}</span>
      <span data-testid="auth">{String(auth.isAuthenticated)}</span>
      <span data-testid="email">{auth.user?.email ?? ""}</span>
    </div>
  );
};

const renderWithProvider = (onReady: (auth: ReturnType<typeof useAuth>) => void) =>
  render(
    <AuthProvider>
      <Probe onReady={onReady} />
    </AuthProvider>,
  );

// Setup ----------------------------------------------------------------------

beforeEach(() => {
  mocks.apiLogin.mockReset();
  mocks.apiMe.mockReset();
  mocks.apiRegister.mockReset();
  mocks.storage.getToken.mockReset();
  mocks.storage.setToken.mockReset();
  mocks.storage.clearToken.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

// Tests ----------------------------------------------------------------------

describe("AuthProvider — session restoration", () => {
  it("sin token en storage: marca sessionFailed y no llama apiMe", async () => {
    mocks.storage.getToken.mockReturnValue(null);
    let captured: ReturnType<typeof useAuth> | null = null;

    renderWithProvider((auth) => {
      captured = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(mocks.apiMe).not.toHaveBeenCalled();
    expect(captured!.isAuthenticated).toBe(false);
    expect(captured!.token).toBeNull();
    expect(captured!.user).toBeNull();
  });

  it("con token válido en storage: restaura la sesión", async () => {
    mocks.storage.getToken.mockReturnValue("stored-jwt");
    mocks.apiMe.mockResolvedValue(fakeUser);

    renderWithProvider(() => {});

    await waitFor(() => {
      expect(screen.getByTestId("auth").textContent).toBe("true");
    });

    expect(mocks.apiMe).toHaveBeenCalledWith("stored-jwt");
    expect(screen.getByTestId("email").textContent).toBe(fakeUser.email);
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("con token inválido: limpia el storage y queda sin sesión", async () => {
    mocks.storage.getToken.mockReturnValue("invalid-jwt");
    mocks.apiMe.mockRejectedValue(new Error("Token inválido"));

    renderWithProvider(() => {});

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(mocks.storage.clearToken).toHaveBeenCalledOnce();
    expect(screen.getByTestId("auth").textContent).toBe("false");
  });
});

describe("AuthProvider — login", () => {
  it("login exitoso: guarda token en storage y autentica al usuario", async () => {
    mocks.storage.getToken.mockReturnValue(null);
    mocks.apiLogin.mockResolvedValue({ user: fakeUser, token: "fresh-jwt" });

    let captured!: ReturnType<typeof useAuth>;
    renderWithProvider((auth) => {
      captured = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    await act(async () => {
      await captured.login("user@example.com", "Password1!");
    });

    expect(mocks.apiLogin).toHaveBeenCalledWith(
      "user@example.com",
      "Password1!",
    );
    expect(mocks.storage.setToken).toHaveBeenCalledWith("fresh-jwt");
    expect(screen.getByTestId("auth").textContent).toBe("true");
    expect(screen.getByTestId("email").textContent).toBe(fakeUser.email);
  });

  it("login con credenciales malas: propaga el error y deja al usuario sin sesión", async () => {
    mocks.storage.getToken.mockReturnValue(null);
    mocks.apiLogin.mockRejectedValue(new Error("Credenciales inválidas"));

    let captured!: ReturnType<typeof useAuth>;
    renderWithProvider((auth) => {
      captured = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    await expect(
      act(async () => {
        await captured.login("user@example.com", "wrong");
      }),
    ).rejects.toThrowError("Credenciales inválidas");

    expect(mocks.storage.setToken).not.toHaveBeenCalled();
    expect(screen.getByTestId("auth").textContent).toBe("false");
  });
});

describe("AuthProvider — logout", () => {
  it("logout limpia el token del storage y resetea el estado", async () => {
    mocks.storage.getToken.mockReturnValue("stored-jwt");
    mocks.apiMe.mockResolvedValue(fakeUser);

    let captured!: ReturnType<typeof useAuth>;
    renderWithProvider((auth) => {
      captured = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth").textContent).toBe("true");
    });

    act(() => {
      captured.logout();
    });

    expect(mocks.storage.clearToken).toHaveBeenCalledOnce();
    expect(screen.getByTestId("auth").textContent).toBe("false");
    expect(screen.getByTestId("email").textContent).toBe("");
  });
});

describe("AuthProvider — verifyPassword", () => {
  it("verifyPassword devuelve true si apiLogin no falla", async () => {
    mocks.storage.getToken.mockReturnValue("stored-jwt");
    mocks.apiMe.mockResolvedValue(fakeUser);
    mocks.apiLogin.mockResolvedValue({ user: fakeUser, token: "any" });

    let captured!: ReturnType<typeof useAuth>;
    renderWithProvider((auth) => {
      captured = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth").textContent).toBe("true");
    });

    let ok = false;
    await act(async () => {
      ok = await captured.verifyPassword("Password1!");
    });

    expect(ok).toBe(true);
    expect(mocks.apiLogin).toHaveBeenCalledWith(
      fakeUser.email,
      "Password1!",
    );
  });

  it("verifyPassword devuelve false si apiLogin falla", async () => {
    mocks.storage.getToken.mockReturnValue("stored-jwt");
    mocks.apiMe.mockResolvedValue(fakeUser);
    mocks.apiLogin.mockRejectedValue(new Error("Credenciales inválidas"));

    let captured!: ReturnType<typeof useAuth>;
    renderWithProvider((auth) => {
      captured = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth").textContent).toBe("true");
    });

    let ok = true;
    await act(async () => {
      ok = await captured.verifyPassword("wrong");
    });

    expect(ok).toBe(false);
  });

  it("verifyPassword devuelve false si no hay user (no llama apiLogin)", async () => {
    mocks.storage.getToken.mockReturnValue(null);

    let captured!: ReturnType<typeof useAuth>;
    renderWithProvider((auth) => {
      captured = auth;
    });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    let ok = true;
    await act(async () => {
      ok = await captured.verifyPassword("anything");
    });

    expect(ok).toBe(false);
    expect(mocks.apiLogin).not.toHaveBeenCalled();
  });
});

describe("useAuth fuera del provider", () => {
  it("tira error explícito si se usa sin AuthProvider", () => {
    const ConsumerWithoutProvider = () => {
      useAuth();
      return null;
    };

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ConsumerWithoutProvider />)).toThrowError(
      /useAuth debe usarse dentro de un <AuthProvider>/,
    );
    spy.mockRestore();
  });
});

// Sanity: el wrapper se monta sin colgar
describe("AuthProvider — render", () => {
  it("renderiza children", async () => {
    mocks.storage.getToken.mockReturnValue(null);
    const Wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    render(<Wrapper>hola</Wrapper>);
    await waitFor(() => {
      expect(screen.getByText("hola")).toBeTruthy();
    });
  });
});
