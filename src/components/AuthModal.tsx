import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { AuthMode } from "../types";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../data/users";

interface AuthModalProps {
  mode: AuthMode | null;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onLogin: (email: string, password: string) => Promise<string | null> | string | null;
  onRegister: (name: string, email: string, password: string) => Promise<string | null> | string | null;
  onDemoLogin: () => Promise<string | null> | string | null;
}

export function AuthModal({ mode, onClose, onModeChange, onLogin, onRegister, onDemoLogin }: AuthModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setIsSubmitting(false);
  }, [mode]);

  if (!mode) {
    return null;
  }

  const isLogin = mode === "login";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = isLogin ? await onLogin(email, password) : await onRegister(name, email, password);

    if (result) {
      setError(result);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onClose();
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setError("");
    const result = await onDemoLogin();

    if (result) {
      setError(result);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-backdrop-custom" role="presentation">
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="icon-button close-button" type="button" aria-label="Zamknij" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-tabs" role="group" aria-label="Tryb konta">
          <button
            className={isLogin ? "is-active" : ""}
            type="button"
            onClick={() => onModeChange("login")}
          >
            Logowanie
          </button>
          <button
            className={!isLogin ? "is-active" : ""}
            type="button"
            onClick={() => onModeChange("register")}
          >
            Rejestracja
          </button>
        </div>

        <h2 id="auth-title">{isLogin ? "Logowanie" : "Nowe konto"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <label className="form-label">
              Imię i nazwisko
              <input
                className="form-control"
                value={name}
                minLength={3}
                required
                onChange={(event) => setName(event.target.value)}
              />
            </label>
          )}

          <label className="form-label">
            E-mail
            <input
              className="form-control"
              type="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="form-label">
            Hasło
            <input
              className="form-control"
              type="password"
              value={password}
              minLength={6}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Przetwarzanie..." : isLogin ? "Zaloguj" : "Utwórz konto"}
          </button>
        </form>

        <button className="btn btn-outline-dark w-100 demo-button" type="button" disabled={isSubmitting} onClick={handleDemoLogin}>
          Konto demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
        </button>
      </section>
    </div>
  );
}
