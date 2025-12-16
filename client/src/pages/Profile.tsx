import { useState } from "react";
import EditProfile from "../components/Profile/EditProfile/EditProfile";
import ProfileNav from "../components/Profile/ProfileNav";
import Role from "../components/Profile/Role";
import Security from "../components/Profile/Security";

const Profile = ({ isLoggedIn, setisLoggedIn }) => {
  const [profileId, setProfileId] = useState(0);
  //   const [isSecurity, setIsSecurity] = useState(false);
  //   const [isRole, setIsRole] = useState(false);
  return (
    <>
      <div className=" sm:flex   mt-10 sm:px-4 md:px-12 xl:px-32 w-full">
        <ProfileNav
          setProfileId={setProfileId}
          isLoggedIn={isLoggedIn}
          setisLoggedIn={setisLoggedIn}
        />
        <div className="sm:ms-5 border-s-2 border-slate-700  sm:border-s-4 border-slate-700 w-full sm:w-10/12 max-h-screen overflow-y-scroll no-scrollbar">
          {profileId === 0 && <EditProfile setProfileId={setProfileId} />}
          {profileId === 1 && <Security />}
          {profileId === 2 && <Role />}
        </div>
      </div>
    </>
  );
};

export default Profile;
