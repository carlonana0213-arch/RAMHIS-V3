import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";

import ramLogo from "../../assets/images/ramhislogo.png";

import AuthLayout from "../../Layout/AuthLayout";
import { useAuth } from "../../Context/AuthContext";

import Button from "../../Components/ui/button";
import Card from "../../Components/ui/card";
import Input from "../../Components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const remembered = localStorage.getItem("rememberEmail");

    if (remembered) {
      setForm((prev) => ({
        ...prev,
        email: remembered,
      }));

      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      return toast.error("Please enter your email.");
    }

    if (!form.password.trim()) {
      return toast.error("Please enter your password.");
    }

    try {
      setLoading(true);

      const user = await login(form);

      if (rememberMe) {
        localStorage.setItem("rememberEmail", form.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      toast.success("Welcome back!");

      const redirect = location.state?.from?.pathname || "/dashboard";

      if (user.role === "Admin") {
        navigate("/dashboard", {
          replace: true,
        });
      } else if (user.role === "Doctor") {
        navigate("/doctor-sheet", {
          replace: true,
        });
      } else {
        navigate(redirect, {
          replace: true,
        });
      }
    } catch (err) {
      toast.error(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card variant="auth" className="w-full rounded-3xl">
        <Card.Header className="text-center">
          <Card.Title className="text-4xl font-bold text-white">
            Welcome Back
          </Card.Title>

          <Card.Subtitle className="mt-2 text-blue-100">
            Sign in to continue to RAMHIS
          </Card.Subtitle>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              leftIcon={<Mail size={18} />}
              variant="auth"
              required
            />

            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              leftIcon={<Lock size={18} />}
              rightIcon={
                showPassword ? <EyeOff size={18} /> : <Eye size={18} />
              }
              onRightIconClick={() => setShowPassword(!showPassword)}
              variant="auth"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-blue-100">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-sky-400"
                />
                Remember Me
              </label>

              <Link
                to="/forgot-password"
                className="text-sky-300 transition hover:text-white"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              variant="auth"
              className="w-full h-14 rounded-2xl text-lg"
            >
              Sign In
            </Button>

            <div className="pt-2 text-center">
              <p className="text-sm text-blue-200">Developed by LIKHA</p>
            </div>
          </form>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
}
