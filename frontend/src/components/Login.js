import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // For redirecting after login
import axios from "axios";

const Login = ({ onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        localStorage.setItem("access", response?.data?.access);
        localStorage.setItem("username", response?.data?.user?.username);
        localStorage.setItem("company", response?.data?.user?.company);
        localStorage.setItem("email", response?.data?.user?.email);
        localStorage.setItem("id", response?.data?.user?.id);
        localStorage.setItem("designation", response?.data?.user?.designation);
        console.log("localStorage is set...");
        setIsSuccessModal(true);
        onLogin();
        
        setTimeout(() => {
          navigate("/home");
          setIsSuccessModal(false);
        }, 2000);
      }
      // if (response.status == 404){
      //   setError("Invalid credentials")
      //   return;
      // }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
    // Simulate API call with a timeout
    // setTimeout(() => {
    //   if (username === "admin" && password === "password") {
    //     navigate("/dashboard"); // Redirect to dashboard upon successful login
    //   } else {
    //     setError("Invalid username or password");
    //   }
    //   setLoading(false);
    // }, 1000); // Simulate network delay
  };

  return (
    <div className="text-white">
      <nav className="p-5 px-20 flex items-center justify-between w-screen">
        <a href="/">
          <img src="/images/logo.png" alt="Logo" className="w-28" />
        </a>
        <div className="flex items-center space-x-4">
          <a
            href="#"
            onClick={() => setIsSignIn(!isSignIn)}
            className="px-6 py-2 border border-yellow-300 text-yellow-300 rounded-full font-semibold hover:bg-yellow-300 hover:text-white transition duration-200"
          >
            {isSignIn ? "Cancel" : "Sign In"}
          </a>
        </div>
      </nav>

      <section className="flex flex-wrap items-center min-h-[700px] max-w-[1128px] mx-auto py-16">
        <div className="w-full md:w-1/2 space-y-6">
          {isSignIn ? (
            // Sign-In Form
            <form
              onSubmit={handleLogin}
              className={`space-y-4 transition-opacity duration-700 w-96 ${
                isSignIn ? "opacity-100" : "opacity-0"
              }`}
            >
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
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
            <h1 className="text-white text-5xl font-semibold font-mono leading-tight">
              'Connecting minds, creating futures.'
            </h1>
          )}
        </div>

        <div className="relative w-full md:w-1/2">
          <img
            src="/images/happy.png"
            alt="cover page"
            className="absolute right-[-150px] bottom-[-2px] w-[700px] h-[670px] rounded-full md:relative md:w-full md:h-auto md:right-auto md:bottom-auto"
          />
        </div>
      </section>
      {isSuccessModal && <SuccessModal />}
    </div>
  );
};

export default Login;

export function SuccessModal() {
  return (
    <div
      // ref={modalRef}
      // onClick={bgModal}
      className="flex fixed justify-center w-screen h-screen left-0 top-0 p-5 text-white items-center backdrop-blur-lg z-[1000]"
      data-aos="fade-in"
    >
      <div className="flex flex-col items-center gap-5 bg-gradient-to-r from-[#34104A] to-[#250939] p-10 rounded-3xl z-[1000]">
        <div className="items-end justify-end flex w-full" data-aos="zoom-in">
          {/* <button className="items-end justify-end flex ">
            <IoClose onClick={closeModal} size={30} />
          </button> */}
        </div>
        <FaCheckCircle color="green" size={50} />
        {/* <i className="ri-close-circle-line text-7xl sm:text-8xl text-red-600"></i> */}
        <p className="text-center text-[14px] sm:text-[18px]">
          Login Successfull.
        </p>
      </div>
    </div>
  );
}

//   import styled from "styled-components";

// const Login = (props) => {
//     return (
//         <Container>
//           <Nav>
//             <a href="/">
//             <img src="/images/Bulletin-writtenlarge.png" alt="" className="h-20 p-0 w-25" />
//             </a>
//             <div>
//                 <Join>Join now</Join>
//                 <SignIn>Sign In</SignIn>
//             </div>
//           </Nav>
//           <Section>
//             <Hero>
//                 <h1>'Connecting minds, creating futures.'</h1>
//                 <img src="/images/happy.png" alt="cover page"/>
//             </Hero>
//             <Form>
//                 <Google>
//                     <img src="/images/google logo.svg" alt="gg" className="h-10"/>
//                     Sign in with Google
//                 </Google>
//             </Form>

//           </Section>
//         </Container>
//     );
// };

// const Container = styled.div`
// padding: 0px;
// `;

// const Nav = styled.nav`

// max-width: 1128px;
// margin: auto;
// padding: 12px 0 16px;
// display: flex;
// align-items: center;
// position: relative;
// justify-content: space-between;
// flex-wrap: nowrap;

// & > a {
//     width: 135px;
//     height: 34px;
//     @media (max-width: 768px) {
//         padding: 0 5px;
//     }
// }
// `;

// const Join = styled.a`
// font-size: 16px;
// padding: 10px 12px;
// text-decoration: none;
// border-radius: 4px;
// color: lightgray;
// margin-right: 12px;

// &:hover {
//     background-color: rgba(0, 0, 0, 0.08);
//     color: darkgray;
//     text-decoration: none;
// }
// `;

// const SignIn = styled.a`
// box-shadow: inset 0 0 0 1px lightgoldenrodyellow;
// color: lightgoldenrodyellow;
// border-radius: 24px;
// transition-duration: 167ms;
// font-size: 16px;
// line-height: 40px;
// font-weight: 600;
// padding: 10px 24px;
// text-align: center;
// background-color: rgba(0, 0, 0, 0);

// &:hover {
//     background-color: rgba(112, 181, 249, 0.15);
//     color: yellow;
//     text-decoration: none;
// }

// `;

// const Section = styled.section`
// display: flex;
// align-content: start;
// min-height: 700px;
// padding-bottom: 138px;
// padding-top: 40px;
// padding: 60px 0;
// position: relative;
// flex-wrap: wrap;
// width: 100%;
// max-width: 1128px;
// align-items: center;
// margin: auto;
// @media (max-width:768px) {
//     margin: auto;
//     min-height: 0px;
// }

// `;

// const Hero = styled.div`
// color: white;
// width: 100%;
// h1 {
//     padding-bottom: 0;
//     width: 55%;
//     font-size: 56px;
//     color: white;
//     font-weight: 200;
//     line-height: 70px;
//     @media (max-width: 768px) {
//         text-align: center;
//         font-size: 20px;
//         width: 100%;
//         line-height: 2;
//     }
// }

// img {

//     width: 700px;
//     height: 670px;
//     position: absolute;
//     bottom: -2px;
//     right: -150px;
//     border-radius: 50%;
//     @media (max-width: 768px) {
//         top: 230px;
//         position: initial;
//         width: initial;
//         height: initial;
//         border-radius: 50%;
//     }
// }

// `;

// const Form=styled.div`
// margin-top: 100px;
// width: 408px;
// @media (max-width: 768px) {
//     margin-top: 20px;

// }
// `;
// const Google=styled.button`
// color: black;
// background-color: white;
// display: flex;
// justify-content: center;
// align-items: center;
// height: 56px;
// width: 100%;
// border-radius: 28px;
// border-color: white;
// box-shadow: inset 0 0 0 1px rgb(0 0 0 / 60%), inset 0 0 0 2px rgb(0 0 0 / 0%) inset 0 0 0 1px rgb(0 0 0 / 0%);
// vertical-align: middle;
// z-index: 0;
// transition-duration: 167ms;
// font-size: 20px;
// color: rgba(0, 0, 0, 0.6);
// &:hover {
//     background-color: rgba(207, 207, 207, 0.25);
//     color: rgba(0, 0, 0, 0.75);
// }
// `;

// export default Login;
