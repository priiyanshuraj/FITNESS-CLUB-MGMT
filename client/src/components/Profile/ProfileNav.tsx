import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { toast, ToastContainer } from "react-toastify";

const ProfileNav = ({
  setProfileId,
  isLoggedIn,
  setisLoggedIn,
}: {
  setProfileId: (id: number) => void;
  isLoggedIn: boolean;
  setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleEditProfile = (id: number) => {
    setProfileId(id);
  };
  const navigate = useNavigate();

  const handleLogOut = () => {
    // ✅ Clear auth data so user is fully logged out
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setisLoggedIn(false);
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    console.log(isLoggedIn);

    navigate("/login");
  };

  return (
    <>
      <div className=" flex flex-col  mx-auto  pt-8  p-2 sm:pt-8  sm:p-5  sm:w-2/12   sm:h-screen ">
        <div className="w-12 h-12 sm:w-36 mx-auto sm:h-36 bg-black rounded-full bg-cover bg-center mb-4 am:mb-8"></div>
        <div className="w-fit flex sm:flex-col gap-5 mx-auto sm:w-full sm:w-full">
          <Button label={"Edit "} onClick={() => handleEditProfile(0)} />
          <Button label={"Security"} onClick={() => handleEditProfile(1)} />
          {/* Role tab is currently unused; can be enabled later if needed */}
          {isLoggedIn && <Button label={"Logout"} onClick={handleLogOut} />}
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default ProfileNav;
