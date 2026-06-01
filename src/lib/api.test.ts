import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, api } from "./api";

const mockFetch = (response: Partial<Response>) => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({}),
    ...response
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

describe("api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts login credentials to the auth endpoint", async () => {
    const fetchMock = mockFetch({
      json: vi.fn().mockResolvedValue({
        token: "token-1",
        user: { id: "u-1", name: "Ala", email: "ala@example.com", role: "klient", joinedAt: "2026-01-01" }
      })
    });

    await expect(api.login("ala@example.com", "secret123")).resolves.toMatchObject({ token: "token-1" });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "ala@example.com", password: "secret123" })
      })
    );
  });

  it("adds bearer token to authenticated requests", async () => {
    const fetchMock = mockFetch({
      json: vi.fn().mockResolvedValue({
        id: "u-1",
        name: "Ala",
        email: "ala@example.com",
        role: "klient",
        joinedAt: "2026-01-01"
      })
    });

    await api.me("signed-token");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/me",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer signed-token" })
      })
    );
  });

  it("returns undefined for 204 responses", async () => {
    mockFetch({ status: 204, json: vi.fn() });

    await expect(api.deleteGame("game-1", "token")).resolves.toBeUndefined();
  });

  it("throws ApiError with backend detail when request fails", async () => {
    mockFetch({
      ok: false,
      status: 409,
      json: vi.fn().mockResolvedValue({ detail: "Gra jest już wypożyczona." })
    });

    await expect(api.borrow("game-1", 14, "token")).rejects.toMatchObject({
      status: 409,
      message: "Gra jest już wypożyczona."
    });
  });
});
