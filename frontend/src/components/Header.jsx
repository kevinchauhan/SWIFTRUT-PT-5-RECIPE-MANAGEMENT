// src/components/Header.js
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Header = () => {
    const { isAuthenticated, logout } = useAuthStore();

    return (
        <header className="bg-white shadow-md text-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-lg font-semibold">
                    <Link to="/" className="hover:text-indigo-600">Recipe Management</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="text-gray-600 hover:text-indigo-600">Signup</Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <button
                                    onClick={logout}
                                    className="text-gray-600 hover:text-indigo-600 focus:outline-none"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
