import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { getDatabase, ref, onValue, off, remove, set, update } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, deleteUser as deleteAuthUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

const Home = ({ navigation }) => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserLastName, setNewUserLastName] = useState('');

    const auth = getAuth();
    const database = getDatabase();
    const navigate = useNavigate();

    useEffect(() => {
        const usersRef = ref(database, 'users');
        onValue(usersRef, (snapshot) => {
            const usersData = snapshot.val();
            if (usersData) {
                const usersArray = Object.keys(usersData).map((key) => ({
                    id: key,
                    email: usersData[key].email,
                    name: usersData[key].name,
                    lastName: usersData[key].lastName,
                    isActive: usersData[key].isActive,
                }));
                setUsers(usersArray);
            }
        });
        return () => {
            off(usersRef);
        };
    }, []);

    const handleNewUserSubmit = async (e) => {
        e.preventDefault();

        try {
            const { user } = await createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword);
            const id = user.uid;

            if (user) {
                const usersRef = ref(database, 'users/' + id);
                const data = {
                    email: newUserEmail,
                    name: newUserName,
                    lastName: newUserLastName,
                    isActive: true, // Nuevo usuario activado por defecto
                    id,
                };

                set(usersRef, data);

                // Limpiar campos del formulario después de la creación del usuario
                setNewUserEmail('');
                setNewUserPassword('');
                setNewUserName('');
                setNewUserLastName('');

                console.log('Usuario creado exitosamente.');
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            if (window.confirm('¿Realmente seguro? Esta acción no se puede deshacer.')) {
                try {
                    const auth = getAuth();
                    const user = auth.currentUser;

                    if (user) {
                        // Eliminar usuario de Firebase Authentication
                        await deleteAuthUser(user);
                        console.log('Usuario eliminado correctamente de la autenticación.');

                        // Eliminar datos del usuario de Firebase Realtime Database
                        const usersRef = ref(database, `users/${userId}`);
                        await remove(usersRef);
                        console.log('Registro de usuario eliminado correctamente.');

                        // Eliminar registros relacionados en la colección 'terrenos'
                        const terrenosRef = ref(database, `terrenos/${userId}`);
                        await remove(terrenosRef);
                        console.log('Registros de terrenos eliminados correctamente.');

                        // Eliminar registros relacionados en la colección 'locations'
                        const locationsRef = ref(database, `locations/${userId}`);
                        await remove(locationsRef);
                        console.log('Registros de ubicaciones eliminados correctamente.');

                        // Actualizar la lista de usuarios para mostrar el cambio
                        const usersRefList = ref(database, `users`);
                        onValue(usersRefList, (snapshot) => {
                            const usersData = snapshot.val();
                            if (usersData) {
                                const usersArray = Object.keys(usersData).map((key) => ({
                                    id: key,
                                    email: usersData[key].email,
                                    name: usersData[key].name,
                                    lastName: usersData[key].lastName,
                                    isActive: usersData[key].isActive,
                                }));
                                setUsers(usersArray);
                            }
                        });
                    } else {
                        console.error('No se encontró un usuario para eliminar.');
                        // Eliminar datos del usuario de Firebase Realtime Database
                        const usersRef = ref(database, `users/${userId}`);
                        await remove(usersRef);
                        console.log('Registro de usuario eliminado correctamente.');

                        // Eliminar registros relacionados en la colección 'terrenos'
                        const terrenosRef = ref(database, `terrenos/${userId}`);
                        await remove(terrenosRef);
                        console.log('Registros de terrenos eliminados correctamente.');

                        // Eliminar registros relacionados en la colección 'locations'
                        const locationsRef = ref(database, `locations/${userId}`);
                        await remove(locationsRef);
                        console.log('Registros de ubicaciones eliminados correctamente.');

                        // Actualizar la lista de usuarios para mostrar el cambio
                        const usersRefList = ref(database, `users`);
                        onValue(usersRefList, (snapshot) => {
                            const usersData = snapshot.val();
                            if (usersData) {
                                const usersArray = Object.keys(usersData).map((key) => ({
                                    id: key,
                                    email: usersData[key].email,
                                    name: usersData[key].name,
                                    lastName: usersData[key].lastName,
                                    isActive: usersData[key].isActive,
                                }));
                                setUsers(usersArray);
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error al eliminar usuario:', error.message);
                }
            }
        }
    };

    const toggleUserActivation = async (userId, isActive) => {
        try {
            const userRef = ref(database, `users/${userId}`);
            await update(userRef, { isActive: !isActive }); // Utilizamos update para actualizar solo el campo isActive
            console.log(`Estado de activación del usuario ${userId} actualizado correctamente.`);
        } catch (error) {
            console.error('Error al cambiar el estado de activación del usuario:', error.message);
        }
    };

    const handleChangePage = () => {
        navigate('/maps');
    };

    return (
        <div className="pt-14 bg-gradient-to-br from-indigo-600 to-purple-600 min-h-screen font-sans text-black">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">Lista de Usuarios</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-lg">
                    {/* Encabezados de la tabla */}
                    <thead className="bg-blue-100 text-blue-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-black">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-black">Nombre</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-black">Apellido</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-black">Estado</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-black">Acciones</th>
                        </tr>
                    </thead>
                    {/* Cuerpo de la tabla */}
                    <tbody className="bg-white divide-y divide-gray-200 text-black">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 text-sm text-black">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-black">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-black">{user.lastName}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm flex space-x-2">
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <button onClick={() => toggleUserActivation(user.id, user.isActive)} className="text-indigo-500 hover:text-indigo-700">
                                        <FontAwesomeIcon icon={user.isActive ? faToggleOff : faToggleOn} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Formulario para agregar nuevo usuario */}
            <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-black">Registrar Nuevo Usuario</h2>
                <form onSubmit={handleNewUserSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-black">Correo Electrónico:</label>
                        <input type="email" id="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-black">Contraseña:</label>
                        <input type="password" id="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-black">Nombre:</label>
                        <input type="text" id="name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-sm font-medium text-black">Apellido:</label>
                        <input type="text" id="lastName" value={newUserLastName} onChange={(e) => setNewUserLastName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                    </div>
                    <button type="submit" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Registrar Usuario</button>
                    <button type="button" onClick={handleChangePage} className="ml-2 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Ubicación de Usuarios</button>
                </form>
            </div>
        </div>
    );
};

export default Home;
