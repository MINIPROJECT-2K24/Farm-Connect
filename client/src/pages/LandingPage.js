import { useNavigate } from "react-router-dom";

const LandPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <h1 className="text-5xl font-bold mb-8">Welcome to Farm Connect</h1>
      <div className="flex flex-col space-y-4">
        <button 
          onClick={() => navigate("/register-farmer")} 
          className="px-6 py-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-green-100 transition duration-200"
        >
          Register as Farmer
        </button>
        <button 
          onClick={() => navigate("/register-buyer")} 
          className="px-6 py-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-green-100 transition duration-200"
        >
          Register as Buyer
        </button>
        <button 
          onClick={() => navigate("/login-farmer")} 
          className="px-6 py-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-green-100 transition duration-200"
        >
          Login as Farmer
        </button>
        <button 
          onClick={() => navigate("/login-buyer")} 
          className="px-6 py-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-green-100 transition duration-200"
        >
          Login as Buyer
        </button>
      </div>
    </div>
  );
};

export default LandPage;
