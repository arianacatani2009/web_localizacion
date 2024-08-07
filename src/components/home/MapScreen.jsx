import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import GoogleMapReact from 'google-map-react';

const MapScreen = () => {
    const [locations, setLocations] = useState([]);
    const [users, setUsers] = useState({});

    useEffect(() => {
        const database = getDatabase();
        const locationsRef = ref(database, 'locations');

        // Escuchar los cambios en la base de datos en tiempo real para las ubicaciones
        const unsubscribeLocations = onValue(locationsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const locationsArray = Object.values(data);
                setLocations(locationsArray);
            }
        });

        // Obtener los datos de usuarios
        const usersRef = ref(database, 'users');
        const unsubscribeUsers = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUsers(data);
            }
        });

        // Detener la escucha cuando el componente se desmonte
        return () => {
            off(locationsRef, 'value', unsubscribeLocations);
            off(usersRef, 'value', unsubscribeUsers);
        };
    }, []);

    return (
        <div style={{ height: '100vh', width: '100%', marginTop: 50 }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyCbCXwS4nzy0SGnZKngXY79lWPwAQYDy3I" }} // Replace with your actual API key
                defaultCenter={{ lat: 0, lng: 0 }}
                defaultZoom={5}
            >
                {/* Iterar sobre las ubicaciones y mostrar los marcadores en el mapa */}
                {locations.map((location) => {
                    const user = users[location.id];
                    const userName = user ? `${user.name} ${user.lastName}` : 'Desconocido';
                    return (
                        <Marker
                            key={location.id}
                            lat={parseFloat(location.latitude)}
                            lng={parseFloat(location.longitud)}
                            text={userName}
                        />
                    );
                })}
            </GoogleMapReact>
        </div>
    );
};

// Componente de marcador personalizado
const Marker = ({ text }) => (
    <div style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '5px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        fontSize: '14px',
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    }}>
        {text}
    </div>
);

export default MapScreen;
