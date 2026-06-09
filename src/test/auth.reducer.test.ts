import { describe, expect, it } from "vitest";
import { authReducer } from "../context/reducer/auth.reducer";
import { initialAuthState } from "../context/reducer/auth.initialState";
import {
  loginSuccess,
  logoutAction,
  sessionFailed,
  sessionRestored,
} from "../context/reducer/auth.actions";
import type { AuthUser } from "../context/reducer/auth.types";

const fakeUser: AuthUser = {
  id: "u-1",
  email: "user@example.com",
  role: "user",
  name: "User",
};

describe("authReducer", () => {
  it("estado inicial tiene token null, user null, isLoading true", () => {
    expect(initialAuthState).toEqual({
      token: null,
      user: null,
      isLoading: true,
    });
  });

  it("LOGIN_SUCCESS guarda token + user y baja isLoading", () => {
    const next = authReducer(initialAuthState, loginSuccess("jwt", fakeUser));
    expect(next).toEqual({ token: "jwt", user: fakeUser, isLoading: false });
  });

  it("SESSION_RESTORED guarda token + user y baja isLoading", () => {
    const next = authReducer(
      initialAuthState,
      sessionRestored("jwt", fakeUser),
    );
    expect(next).toEqual({ token: "jwt", user: fakeUser, isLoading: false });
  });

  it("SESSION_FAILED limpia token + user y baja isLoading", () => {
    const next = authReducer(initialAuthState, sessionFailed());
    expect(next).toEqual({ token: null, user: null, isLoading: false });
  });

  it("LOGOUT limpia token + user partiendo de estado autenticado", () => {
    const authenticated = {
      token: "jwt",
      user: fakeUser,
      isLoading: false,
    };
    const next = authReducer(authenticated, logoutAction());
    expect(next).toEqual({ token: null, user: null, isLoading: false });
  });

  it("una acción desconocida deja el estado sin cambios", () => {
    const state = { token: "jwt", user: fakeUser, isLoading: false };
    // @ts-expect-error — probando exhaustividad con una acción no válida
    const next = authReducer(state, { type: "DESCONOCIDO" });
    expect(next).toBe(state);
  });

  it("es una función pura: no muta el estado previo", () => {
    const snapshot = JSON.parse(JSON.stringify(initialAuthState));
    authReducer(initialAuthState, loginSuccess("jwt", fakeUser));
    expect(initialAuthState).toEqual(snapshot);
  });
});
