import { auth, database } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
} from "firebase/auth";

// Función para crear usuario en Firebase Authentication y guardar datos en Realtime Database
export const doCreateUserWithEmailAndPassword = async (email, password, name, lastName) => {
  // Crear usuario en Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Guardar datos adicionales en Realtime Database
  await database.ref('users/' + user.uid).set({
    email: email,
    name: name,
    lastName: lastName
  });

  return user;
};

// Función para iniciar sesión con email y contraseña
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Función para cerrar sesión
export const doSignOut = () => {
  return auth.signOut();
};

// Función para enviar correo de restablecimiento de contraseña
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Función para cambiar la contraseña del usuario actual
export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

// Función para enviar correo de verificación
export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
