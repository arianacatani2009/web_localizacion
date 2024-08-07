import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'

const Register = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isRegistering) {
            setIsRegistering(true)
            try {
                await doCreateUserWithEmailAndPassword(email, password, name, lastName)
                navigate('/home')
            } catch (error) {
                setErrorMessage(error.message)
                setIsRegistering(false)
            }
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 min-h-screen flex items-center justify-center font-sans">
                <main className="w-full h-screen flex self-center place-content-center place-items-center">
                    <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl bg-white">
                        <div className="text-center mb-6">
                            <div className="mt-2">
                                <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Crear una Cuenta Nueva</h3>
                            </div>
                        </div>
                        <form
                            onSubmit={onSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label className="text-sm text-gray-600 font-bold">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    autoComplete='email'
                                    required
                                    value={email} onChange={(e) => { setEmail(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-bold">
                                    Contraseña
                                </label>
                                <input
                                    disabled={isRegistering}
                                    type="password"
                                    autoComplete='new-password'
                                    required
                                    value={password} onChange={(e) => { setPassword(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-bold">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    disabled={isRegistering}
                                    type="password"
                                    autoComplete='off'
                                    required
                                    value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-bold">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    autoComplete='given-name'
                                    required
                                    value={name} onChange={(e) => { setName(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 font-bold">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    autoComplete='family-name'
                                    required
                                    value={lastName} onChange={(e) => { setLastName(e.target.value) }}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                />
                            </div>

                            {errorMessage && (
                                <span className='text-red-600 font-bold'>{errorMessage}</span>
                            )}

                            <button
                                type="submit"
                                disabled={isRegistering}
                                className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                            >
                                {isRegistering ? 'Registrando...' : 'Registrarse'}
                            </button>
                            <div className="text-sm text-center">
                                ¿Ya tienes una cuenta? {'   '}
                                <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Iniciar Sesión</Link>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    )
}

export default Register
