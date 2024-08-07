import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { getDatabase, ref, onValue, off, remove, set, update } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, deleteUser as deleteAuthUser } from 'firebase/auth';
import { get, child } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

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

                        let id; // Declare the variable
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
                                    id,
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

                        let id; // Declare the variable
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
                                    id,
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
        <div className="pt-14">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* Encabezados de la tabla */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Last Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {/* Cuerpo de la tabla */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td>{user.lastName}</td>
                                <td>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                    <button onClick={() => toggleUserActivation(user.id, user.isActive)} className="ml-2">{user.isActive ? 'Deactivate' : 'Activate'}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Formulario para agregar nuevo usuario */}
            <div className="mt-8 max-w-md mx-auto">
                <h2 className="text-lg font-semibold">Agregar Nuevo Usuario</h2>
                <form onSubmit={handleNewUserSubmit} className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input type="email" id="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña:</label>
                        <input type="password" id="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre:</label>
                        <input type="text" id="name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido:</label>
                        <input type="text" id="lastName" value={newUserLastName} onChange={(e) => setNewUserLastName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <button type="submit" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Registrar Usuario</button>

                    <button type="button" onClick={handleChangePage}>Ubicacion de mineros</button>

                </form>
            </div>
        </div>
    );
};

export default Home;
