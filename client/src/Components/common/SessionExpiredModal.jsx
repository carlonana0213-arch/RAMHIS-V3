import { FaLock } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";

export default function SessionExpiredModal() {
  const { sessionExpired, logout } = useAuth();

  if (!sessionExpired) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-expired-title"
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl
          bg-white
          p-7
          shadow-2xl
        "
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <FaLock className="text-2xl text-red-600" />
        </div>

        <h2
          id="session-expired-title"
          className="mt-5 text-center text-xl font-bold text-slate-900"
        >
          Session Expired
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-slate-600">
          You have been inactive for 15 minutes. For your security, your session
          has expired.
        </p>

        <p className="mt-2 text-center text-sm text-slate-500">
          Please log in again to continue using RAMHIS.
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="
            mt-6
            flex h-11 w-full
            items-center justify-center
            rounded-xl
            bg-primary-700
            px-4
            text-sm font-semibold
            text-white
            transition
            hover:bg-primary-800
            focus:outline-none
            focus:ring-2
            focus:ring-primary-500
            focus:ring-offset-2
          "
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
