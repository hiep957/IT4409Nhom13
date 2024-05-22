import { Link } from "react-router-dom";
// import { useAppContext } from "../contexts/AppContext";
// import SignOutButton from "./SignOutButton";

const Header = () => {
  //   const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">SmartBooking.com</Link>
        </span>
        <span className="flex space-x-2">
          <Link
            to="/login"
            className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
          >
            Login
          </Link>
          <Link to = "/register" className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"> Sigeenup </Link>
        </span>
      </div>
    </div>
  );
};

export default Header;
