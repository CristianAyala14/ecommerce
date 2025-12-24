import "./Profile.css";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  setAccessToken,
} from "../../redux/user/userSlice";
import { useAuthContext } from "../../contexts/authContext";
import { updateUserReq } from "../../apiCalls/userCalls";
import { uploadProfileImgReq } from "../../apiCalls/uploadCalls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

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
    currentPassword: "",
    newPassword: "",
  });

  const [originalUser, setOriginalUser] = useState(updateUser);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [validUserName, setValidUserName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validCurrentPassword, setValidCurrentPassword] = useState(true);
  const [validNewPassword, setValidNewPassword] = useState(true);

  const [img, setImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const [frontErrorMessage, setFrontErrorMessage] = useState("");

  /* ================= VALIDATIONS ================= */
  useEffect(() => {
    setValidUserName(userNameRegex.test(updateUser.userName));
  }, [updateUser.userName]);

  useEffect(() => {
    setValidEmail(emailRegex.test(updateUser.email));
  }, [updateUser.email]);

  useEffect(() => {
    if (updateUser.currentPassword)
      setValidCurrentPassword(passwordRegex.test(updateUser.currentPassword));
    else setValidCurrentPassword(true);
  }, [updateUser.currentPassword]);

  useEffect(() => {
    if (updateUser.newPassword)
      setValidNewPassword(passwordRegex.test(updateUser.newPassword));
    else setValidNewPassword(true);
  }, [updateUser.newPassword]);

  // Timer para mensajes temporales
  useEffect(() => {
    if (frontErrorMessage) {
      const timer = setTimeout(() => setFrontErrorMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [frontErrorMessage]);

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
    setFrontErrorMessage("");
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
        setFrontErrorMessage("");
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
    setFrontErrorMessage("");

    if (!validUserName || !validEmail) {
      setFrontErrorMessage("Username or Email are invalid.");
      return;
    }

    if (updateUser.newPassword) {
      if (!updateUser.currentPassword || !updateUser.newPassword) {
        setFrontErrorMessage("Both current and new password are required.");
        return;
      }
      if (!validCurrentPassword || !validNewPassword) {
        setFrontErrorMessage(
          "Password must be 8–16 chars, uppercase, lowercase, number and !@#$%"
        );
        return;
      }
    }

    try {
      dispatch(updateUserStart());

      let profileImageUrl = updateUser.profileImage;

      if (img) {
        const url = await uploadImage(img);
        if (url) profileImageUrl = url;
      }

      const updatedData = {
        userName: updateUser.userName,
        email: updateUser.email,
        profileImage: profileImageUrl,
        currentPassword: updateUser.currentPassword,
        newPassword: updateUser.newPassword,
      };

      const res = await updateUserReq(updatedData);

      if (!res.ok) {
        setFrontErrorMessage(res.message || "Error updating profile.");
        dispatch(updateUserFailure(res.message));
        return;
      }

      dispatch(updateUserSuccess(res.payload.user));
      dispatch(setAccessToken(res.payload.accessToken));

      setUpdateSuccess(true);
      setEditEnabled(false);
      setImg(null);
      setPreviewImg(null);
      setUpdateUser((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      setFrontErrorMessage(err.message || "Error updating profile.");
      dispatch(updateUserFailure(err.message));
    }
  };

  if (!user) return <p>Loading profile...</p>;

  /* ================= ICON LOGIC ================= */
  const renderIcon = (isValid, value) => {
    if (!value) return null;
    return isValid ? faCheck : faTimes;
  };

  return (
    <div className="profile-wrapper">
      <div className={`profile-container ${editEnabled ? "edit-mode" : ""}`}>
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
            className={`profile-image ${
              editEnabled ? "editable" : "readonly"
            }`}
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
              {!validEmail && <span className="error-inline">Invalid email</span>}
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

          {/* NEW PASSWORD */}
          {editEnabled && (
            <div className="form-group">
              <div className="label-row">
                <label>New Password</label>
                <span
                  className={`icon ${
                    updateUser.newPassword
                      ? validNewPassword
                        ? "show valid"
                        : "show invalid"
                      : ""
                  }`}
                >
                  {renderIcon(validNewPassword, updateUser.newPassword) && (
                    <FontAwesomeIcon
                      icon={renderIcon(validNewPassword, updateUser.newPassword)}
                    />
                  )}
                </span>
              </div>
              <input
                type="password"
                value={updateUser.newPassword}
                onChange={(e) =>
                  setUpdateUser({ ...updateUser, newPassword: e.target.value })
                }
                placeholder="********"
              />
            </div>
          )}

          {/* CURRENT PASSWORD */}
          {editEnabled && updateUser.newPassword && (
            <div className="form-group">
              <div className="label-row">
                <label>Current Password</label>
                <span
                  className={`icon ${
                    updateUser.currentPassword
                      ? validCurrentPassword
                        ? "show valid"
                        : "show invalid"
                      : ""
                  }`}
                >
                  {renderIcon(validCurrentPassword, updateUser.currentPassword) && (
                    <FontAwesomeIcon
                      icon={renderIcon(
                        validCurrentPassword,
                        updateUser.currentPassword
                      )}
                    />
                  )}
                </span>
              </div>
              <input
                type="password"
                value={updateUser.currentPassword}
                onChange={(e) =>
                  setUpdateUser({ ...updateUser, currentPassword: e.target.value })
                }
                placeholder="********"
              />
            </div>
          )}

          {/* SUCCESS / ERROR */}
          <div className="success-slot">
            {updateSuccess && (
              <p className="success">Profile updated successfully</p>
            )}
            {frontErrorMessage && <p className="error">{frontErrorMessage}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
