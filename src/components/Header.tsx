import { Gamepad2, LogIn, LogOut, ShieldCheck, UserRound } from "lucide-react";
import type { AppUser, AuthMode } from "../types";

interface HeaderProps {
  currentUser?: AppUser;
  canOpenStaffPanel: boolean;
  onOpenAuth: (mode: AuthMode) => void;
  onOpenProfile: () => void;
  onOpenStaffPanel: () => void;
  onLogout: () => void;
}

export function Header({
  currentUser,
  canOpenStaffPanel,
  onOpenAuth,
  onOpenProfile,
  onOpenStaffPanel,
  onLogout
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-mark" aria-hidden="true">
        <Gamepad2 size={24} />
      </div>
      <div className="brand-copy">
        <span className="brand-name">Gralnia</span>
        <span className="brand-subtitle">wypożyczalnia gier planszowych</span>
      </div>

      <div className="header-actions">
        {currentUser ? (
          <>
            {canOpenStaffPanel && (
              <button className="header-nav-button" type="button" onClick={onOpenStaffPanel}>
                <ShieldCheck size={17} />
                Panel Pracownika
              </button>
            )}
            <button className="user-chip" type="button" onClick={onOpenProfile}>
              <UserRound size={17} />
              {currentUser.name}
            </button>
            <button className="btn btn-outline-dark btn-sm" type="button" onClick={onLogout}>
              <LogOut size={16} />
              Wyloguj
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-outline-dark btn-sm"
              type="button"
              onClick={() => onOpenAuth("register")}
            >
              Rejestracja
            </button>
            <button className="btn btn-dark btn-sm" type="button" onClick={() => onOpenAuth("login")}>
              <LogIn size={16} />
              Logowanie
            </button>
          </>
        )}
      </div>
    </header>
  );
}
