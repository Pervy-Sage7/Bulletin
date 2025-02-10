const Header = ({isSignIn, setIsSignIn}) => {
  return (
    <nav className="p-5 sm:px-20 flex items-center justify-between w-screen">
      <a href="/">
        <img src="/images/logo.png" alt="Logo" className="w-28" />
      </a>
      <div className="flex items-center space-x-4">
        <button
          onClick={setIsSignIn}
          className="px-6 py-2 border border-yellow-300 text-yellow-300 rounded-full font-semibold hover:bg-yellow-300 hover:text-white transition duration-200"
        >
          {isSignIn ? "Cancel" : "Sign In"}
        </button>
      </div>
    </nav>
  );
};

export default Header;
