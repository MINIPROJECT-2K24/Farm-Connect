import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Farm Connect</h1>
      <button onClick={() => navigate("/register-farmer")}>
        Register as Farmer
      </button>
      <button onClick={() => navigate("/register-buyer")}>
        Register as Buyer
      </button>
      <button onClick={() => navigate("/login-farmer")}>Login as Farmer</button>
      <button onClick={() => navigate("/login-buyer")}>Login as Buyer</button>
    </div>
  );
};

export default HomePage;
