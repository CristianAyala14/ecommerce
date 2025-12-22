import "./Profile.css";
import React, { useEffect, useState, useRef } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  setAccessToken,
} from "../../redux/user/userSlice";

// auth context
import { useAuthContext } from "../../contexts/authContext";

// api calls
import { updateUserReq } from "../../apiCalls/userCalls";
import { uploadProfileImgReq } from "../../apiCalls/uploadCalls";

/* REGEX */
const userNameRegex = /^[a-zA-Z][a-zA-Z0-9-_]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,16}$/;

export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const { loading } = useAuthContext();
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [editEnabled, setEditEnabled] = useState(false);

  const [updateUser, setUpdateUser] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    profileImage: user?.profileImage || "",
    password: "",
  });

  const [originalUser, setOriginalUser] = useState(updateUser);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [validUserName, setValidUserName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  const [img, setImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  /* ================= VALIDATIONS ================= */
  useEffect(() => {
    setValidUserName(userNameRegex.test(updateUser.userName));
  }, [updateUser.userName]);

  useEffect(() => {
    setValidEmail(emailRegex.test(updateUser.email));
  }, [updateUser.email]);

  useEffect(() => {
    if (updateUser.password) {
      setValidPassword(passwordRegex.test(updateUser.password));
    } else {
      setValidPassword(true);
    }
  }, [updateUser.password]);

  useEffect(() => {
    if (!updateSuccess) return;
    const timer = setTimeout(() => setUpdateSuccess(false), 2000);
    return () => clearTimeout(timer);
  }, [updateSuccess]);

  /* ================= HELPERS ================= */
  const hasChanges =
    JSON.stringify(updateUser) !== JSON.stringify(originalUser) || img;

  const enterEditMode = () => {
    setEditEnabled(true);
    setOriginalUser(updateUser);
    setUpdateSuccess(false);
  };

  const exitEditMode = async () => {
    if (hasChanges) {
      const confirmSave = window.confirm(
        "Tenés cambios sin guardar. ¿Querés guardarlos?"
      );

      if (confirmSave) {
        await handleUpdate();
      } else {
        setUpdateUser(originalUser);
        setImg(null);
        setPreviewImg(null);
      }
    }
    setEditEnabled(false);
  };

  /* ================= UPLOAD IMAGE ================= */
  const uploadImage = async (img) => {
    const formData = new FormData();
    formData.append("file", img);
    const res = await uploadProfileImgReq(formData);
    return res.url;
  };

  /* ================= HANDLE UPDATE ================= */
  const handleUpdate = async () => {
    if (!validUserName || !validEmail || !validPassword) return;

    try {
      dispatch(updateUserStart());

      let profileImageUrl = updateUser.profileImage;

      if (img) {
        const url = await uploadImage(img);
        if (url) profileImageUrl = url;
      }

      const updatedData = {
        ...updateUser,
        profileImage: profileImageUrl,
      };

      const res = await updateUserReq(updatedData);

      dispatch(updateUserSuccess(res.payload.user));
      dispatch(setAccessToken(res.payload.accessToken));

      setUpdateSuccess(true);
      setEditEnabled(false);
      setImg(null);
      setPreviewImg(null);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-header">
          <button
            className="header-icon left"
            onClick={editEnabled ? exitEditMode : enterEditMode}
          >
            {editEnabled ? "✖" : "✏️"}
          </button>

          <h2>Edit Profile</h2>

          {editEnabled && (
            <button
              className="header-icon right"
              onClick={handleUpdate}
              disabled={loading}
            >
              💾
            </button>
          )}
        </div>

        <div className="profile-image-section">
          <input
            type="file"
            hidden
            ref={fileRef}
            accept="image/*"
            disabled={!editEnabled}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImg(file);
                const tempURL = URL.createObjectURL(file);
                setPreviewImg(tempURL);
                setUpdateUser((prev) => ({
                  ...prev,
                  profileImage: tempURL,
                }));
              }
            }}
          />

          <img
            src={previewImg || updateUser.profileImage}
            alt="profile"
            className="profile-image"
            onClick={() => editEnabled && fileRef.current.click()}
          />
        </div>

        <form className="profile-form">
          {/* USERNAME */}
          <div className="form-group">
            <div className="label-row">
              <label>Username</label>
              {!validUserName && (
                <span className="error-inline">Invalid username</span>
              )}
            </div>
            <input
              type="text"
              value={updateUser.userName}
              disabled={!editEnabled}
              onChange={(e) =>
                setUpdateUser({ ...updateUser, userName: e.target.value })
              }
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <div className="label-row">
              <label>Email</label>
              {!validEmail && (
                <span className="error-inline">Invalid email</span>
              )}
            </div>
            <input
              type="email"
              value={updateUser.email}
              disabled={!editEnabled}
              onChange={(e) =>
                setUpdateUser({ ...updateUser, email: e.target.value })
              }
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              {!validPassword && (
                <span className="error-inline">Invalid password</span>
              )}
            </div>
            <input
              type="password"
              placeholder="********"
              disabled={!editEnabled}
              onChange={(e) =>
                setUpdateUser({ ...updateUser, password: e.target.value })
              }
            />
          </div>

          {/* SUCCESS SLOT (altura fija) */}
          <div className="success-slot">
            {updateSuccess && (
              <p className="success">Profile updated successfully</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
