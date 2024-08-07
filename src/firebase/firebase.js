import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyB499YesSkI5sf6yN5kgaCEeAHX4bhrmrw",
  authDomain: "movileslocation.firebaseapp.com",
  databaseURL: "https://movileslocation-default-rtdb.firebaseio.com",
  projectId: "movileslocation",
  storageBucket: "movileslocation.appspot.com",
  messagingSenderId: "152987672943",
  appId: "1:152987672943:web:db8cb2ea690a86b449c89a"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); 

export { app, auth, database };
