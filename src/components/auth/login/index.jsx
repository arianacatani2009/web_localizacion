import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doSignInWithEmailAndPassword } from '../../../firebase/auth';

const Login = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                // Autenticar al usuario
                await doSignInWithEmailAndPassword(email, password);
                // Redireccionar si el usuario está autenticado
            } catch (error) {
                setErrorMessage(error.message);
                setIsSigningIn(false);
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 min-h-screen flex items-center justify-center font-sans">
            {userLoggedIn && <Navigate to={'/home'} replace={true} />}
            <main className="w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 bg-white text-gray-600 space-y-5 p-6 shadow-2xl border border-gray-200 rounded-2xl">
                    <div className="text-center">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-2xl font-semibold sm:text-3xl">Iniciar Sesión en Localización</h3>
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm text-gray-600 font-bold">Email</label>
                            <input
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-700 bg-gray-100 outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">Password</label>
                            <input
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-700 bg-gray-100 outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {errorMessage && <span className="text-red-600 font-bold">{errorMessage}</span>}

                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={`w-full px-4 py-2 text-white font-medium rounded-full ${isSigningIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 hover:shadow-xl transition duration-300'
                                }`}
                        >
                            {isSigningIn ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>

                    <div className="text-center pt-5">
                        <Link to="/register" className="text-indigo-600 hover:underline">
                            Crear una cuenta
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
