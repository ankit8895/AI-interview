import { motion } from "motion/react";
import { useState } from "react";
import { BsCoin, BsRobot } from "react-icons/bs";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../redux/reducers/userReducer";
import AuthPopup from "./AuthPopup";
import toast from "react-hot-toast";

const Navbar = () => {
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userReducer);

  const handleLogout = async () => {
    try {
      await dispatch(userLogout()).unwrap();
      toast.success("Logged out successfully");
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again");
      console.error("Error logout:", error);
    }
  };
  return (
    <div className="bg-[#f3f3f3] flex justify-center px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center"
      >
        <div className=" flex items-center gap-3 cursor-pointer">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h1 className="font-semibold hidden md:block text-lg">
            Intervuedot.AI
          </h1>
        </div>

        <div className="flex items-center gap-6 relative">
          <div className="relative">
            <button
              onClick={() => {
                if (!userInfo) {
                  setShowAuthPopup(true);
                  return;
                }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition cursor-pointer"
            >
              <BsCoin size={20} />
              {userInfo?.credits || 0}
            </button>

            {showCreditPopup && (
              <div className="absolute -right-12.5 mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded p-5 z-50">
                <p className="text-sm text-gray-600 mb-4">
                  Need more credits to continue interview
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm cursor-pointer"
                >
                  Buy more credits
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                if (!userInfo) {
                  setShowAuthPopup(true);
                  return;
                }
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false);
              }}
              className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibol cursor-pointer"
            >
              {userInfo ? (
                userInfo?.name.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut size={16} />
              )}
            </button>

            {showUserPopup && (
              <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl border-gray-200 rounded-xl p-4 z-50">
                <p className="text-md text-blue-500 font-medium mb-1">
                  {userInfo?.name}
                </p>
                <button
                  onClick={() => navigate("/history")}
                  className="w-full text-left text-sm py-2 hover:text-black text-gray-600"
                >
                  Interview History
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm py-2 flex items-center gap-2 text-red-500"
                >
                  <HiOutlineLogout size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
    </div>
  );
};

export default Navbar;
