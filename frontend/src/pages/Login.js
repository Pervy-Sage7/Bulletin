import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { SuccessModal } from "../components/successModal";

const Login = ({ onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [error, setError] = useState(null);
  // const navigate = useNavigate();

  // Simulating API call for user verification
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      email: username,
      password: password,
    };

    console.log("Data: ", data);

    try {
      const response = await axios.post(
        "https://bulletin-xi93.onrender.com/user/login/",
        data
      );

      console.log("Response: ", response);

      if (response?.data?.access) {
        localStorage.setItem("userData", JSON.stringify(response?.data?.user));
        localStorage.setItem("access", response?.data?.access);
        setIsSuccessModal(true);

        setTimeout(() => {
          setIsSuccessModal(false);
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log("Error: ", error);
      // console.log(error?.response?.data?.error);
      if (error?.response?.data?.error) {
        setError(error?.response?.data?.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <Header isSignIn={isSignIn} setIsSignIn={() => setIsSignIn(!isSignIn)} />

      <section className="flex flex-col lg:flex-row items-center justify-center sm:justify-between gap-10 w-full h-screen md:p-16">
        <div className="flex justify-center w-full md:w-1/2 p-3">
          {isSignIn ? (
            // Sign-In Form
            <form
              onSubmit={handleLogin}
              className={`space-y-4 transition-opacity duration-700 w-full sm:w-96 ${
                isSignIn ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="w-full">
                <label className="block text-sm font-medium">Email</label>
                <input
                  disabled={loading}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  disabled={loading}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md"
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}

              <button
                type="submit"
                className="w-full py-2 mt-4 bg-yellow-300 text-black rounded-full font-semibold hover:bg-yellow-400 transition duration-200"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <div className="flex justify-center items-center w-full text-center">
              <h1 className="text-white text-[20px] sm:text-[48px] font-semibold font-mono leading-tight">
                'Connecting minds, creating futures.'
              </h1>
            </div>
          )}
        </div>

        <div className=" w-full md:w-1/2 p-3">
          <img
            src="/images/happy.png"
            alt="cover page"
            className=" sm:w-[700px] sm:h-[670px] rounded-full md:relative md:w-full md:h-auto md:right-auto md:bottom-auto"
          />
        </div>
      </section>
      {isSuccessModal && <SuccessModal text="Login Successful" />}
    </div>
  );
};

export default Login;
