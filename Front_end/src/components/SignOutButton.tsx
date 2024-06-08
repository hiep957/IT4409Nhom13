import { useMutation, useQueryClient } from "react-query";
import * as ApiClient from "../Api/ApiClient";
import { useAppContext } from "../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const mutation = useMutation(ApiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Signed Out!", type: "SUCCESS" });
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="text-left w-full"
    
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;