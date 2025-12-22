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

  // Inicializamos updateUser con valores del user (si existe)
  const [updateUser, setUpdateUser] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    profileImage: user?.profileImage || "",
    password: "",
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);

  // VALIDATION STATES
  const [validUserName, setValidUserName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [img, setImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null); // preview de la imagen

  /* =========================
     VALIDATIONS
  ========================== */
  useEffect(() => {
    if (updateUser.userName !== undefined) {
      setValidUserName(userNameRegex.test(updateUser.userName));
    }
  }, [updateUser.userName]);

  useEffect(() => {
    if (updateUser.email !== undefined) {
      setValidEmail(emailRegex.test(updateUser.email));
    }
  }, [updateUser.email]);

  useEffect(() => {
    if (updateUser.password !== undefined && updateUser.password !== "") {
      setValidPassword(passwordRegex.test(updateUser.password));
    } else {
      setValidPassword(true); // si está vacío no validamos
    }
  }, [updateUser.password]);

  // Limpiar URL temporal al desmontar o cambiar imagen
  useEffect(() => {
    return () => {
      if (previewImg) URL.revokeObjectURL(previewImg);
    };
  }, [previewImg]);

  /* =========================
     UPLOAD IMAGE
  ========================== */
  const uploadImage = async (img) => {
    const formData = new FormData();
    formData.append("file", img);
    const res = await uploadProfileImgReq(formData);
    return res.url;
  };

  /* =========================
     HANDLE UPDATE USER
  ========================== */
  const handleUpdate = async () => {
    if (!validUserName || !validEmail || !validPassword) return;

    try {
      dispatch(updateUserStart());

      let profileImageUrl = updateUser.profileImage;
      if (img) {
        const url = await uploadImage(img);
        if (url) profileImageUrl = url; // reemplazamos con la URL real
      }

      // Armamos el objeto final para enviar al backend
      const updatedData = {
        ...updateUser,
        profileImage: profileImageUrl,
      };

      const res = await updateUserReq(updatedData);

      dispatch(updateUserSuccess(res.payload.user));
      dispatch(setAccessToken(res.payload.accessToken));

      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  /* =========================
     RENDER
  ========================== */
  // Esperamos a que user exista para renderizar el formulario
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Edit Profile</h2>
        <button
          className="save-btn"
          disabled={loading}
          onClick={handleUpdate}
        >
          ✓
        </button>
      </div>

      {/* PROFILE IMAGE */}
      <div className="profile-image-section">
        <input
          type="file"
          hidden
          ref={fileRef}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImg(file); // Guardamos el archivo
              const tempURL = URL.createObjectURL(file);
              setPreviewImg(tempURL); // preview temporal
              setUpdateUser((prev) => ({
                ...prev,
                profileImage: tempURL,
              }));
            }
          }}
        />

        <img
          src={previewImg || user?.profileImage || ""}
          alt="profile"
          className="profile-image"
          onClick={() => fileRef.current.click()}
        />
      </div>

      {/* FORM */}
      <form
        className="profile-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            defaultValue={user?.userName || ""}
            onChange={(e) =>
              setUpdateUser({ ...updateUser, userName: e.target.value })
            }
          />
          {!validUserName && <span className="error">Invalid username</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            defaultValue={user?.email || ""}
            onChange={(e) =>
              setUpdateUser({ ...updateUser, email: e.target.value })
            }
          />
          {!validEmail && <span className="error">Invalid email</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            onChange={(e) =>
              setUpdateUser({ ...updateUser, password: e.target.value })
            }
          />
          {!validPassword && <span className="error">Invalid password</span>}
        </div>

        {updateSuccess && (
          <p className="success">Profile updated successfully</p>
        )}
      </form>
    </div>
  );
}
