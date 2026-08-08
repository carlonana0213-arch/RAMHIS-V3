import background from "../assets/images/ramhis-login.png";

export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-end xl:pr-40"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-black/30" />

      {/* Login Container */}

      <div className="relative z-10 flex w-full justify-end px-8 lg:px-20">
        <div className="w-full max-w-lg">{children}</div>
      </div>
    </div>
  );
}
