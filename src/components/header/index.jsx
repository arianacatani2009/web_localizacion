import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    return (
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
            {
                userLoggedIn
                    ?
                    <button
                        onClick={() => { doSignOut().then(() => { navigate('/login') }) }}
                        className='flex items-center text-sm text-blue-600 bg-white border border-blue-600 rounded px-2 py-1 hover:bg-blue-100'
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className='mr-2' />
                        Logout
                    </button>
                    :
                    <>
                        <Link
                            className='flex items-center text-sm text-blue-600 bg-white border border-blue-600 rounded px-2 py-1 hover:bg-blue-100'
                            to={'/login'}
                        >
                            <FontAwesomeIcon icon={faSignInAlt} className='mr-2' />
                            Login
                        </Link>
                        <Link
                            className='flex items-center text-sm text-blue-600 bg-white border border-blue-600 rounded px-2 py-1 hover:bg-blue-100'
                            to={'/register'}
                        >
                            <FontAwesomeIcon icon={faUserPlus} className='mr-2' />
                            Register New Account
                        </Link>
                    </>
            }
        </nav>
    );
};

export default Header;
