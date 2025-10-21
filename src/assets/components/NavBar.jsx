import { useEffect, useState, useContext, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSignOut } from "../systems/SaveLoad.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { UserContext } from "../../UserContext.jsx";
import { saveUserData } from "../../firebaseUtils.js";

const navItems = [
    { path: "/", label: "Início", icon: "🏠" },
    { path: "/individual", label: "Individual", icon: "👤" },
    { path: "/caracteristicas", label: "Características", icon: "⭐" },
    { path: "/status", label: "Status", icon: "📊" },
    { path: "/skills", label: "Skills", icon: "🎯" },
    { path: "/anotacoes", label: "Anotações", icon: "📝" },
    { path: "/inventario", label: "Inventário", icon: "🎒" },
];

export default function NavBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const { userData, setUserData } = useContext(UserContext);

    const location = useLocation();
    const navigate = useNavigate();
    const signOut = useSignOut();

    const handleSidebarToggle = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    const handleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);

    const handleLogout = useCallback(() => {
        saveUserData(userData);
        signOut();
        setUserData({ nivel: 0 });
    }, [userData, signOut, setUserData]);

    const handleAuthAction = useCallback(() => {
        if (currentUser) {
            handleLogout();
        } else {
            navigate("/login");
        }
        setIsSidebarOpen(false);
    }, [currentUser, handleLogout, navigate]);

    const handleNavItemClick = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
        return () => unsubscribe();
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Menu Button - Fixed Top Right */}
            <button
                onClick={handleSidebarToggle}
                className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-lg bg-[#171d2e]/90 backdrop-blur-md text-white hover:bg-[#1f2937] transition-all duration-300 shadow-lg border border-white/10"
                aria-label="Toggle Menu"
            >
                <svg
                    className="h-6 w-6 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {isSidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={handleSidebarToggle}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-background border-r border-white/10 z-40 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64 transition-transform duration-300 ease-in-out lg:transition-none`}
            >
                <div className="flex flex-col h-full">
                    {/* Header with Logo */}
                    <div className={`flex items-center p-4 border-b border-white/10 ${
                        isCollapsed ? 'lg:justify-center' : 'justify-between'
                    }`}>
                        {/* Modo expandido: mostra MidNight + botão collapse */}
                        <Link
                            to="/"
                            onClick={handleNavItemClick}
                            className={`font-[Brevis] text-2xl font-bold text-white hover:text-blue-400 transition-all duration-300 ${
                                isCollapsed ? 'lg:hidden' : ''
                            }`}
                        >
                            MidNight
                        </Link>
                        <button
                            onClick={handleCollapse}
                            className={`hidden lg:block p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white ${
                                isCollapsed ? 'lg:hidden' : ''
                            }`}
                            aria-label="Toggle Sidebar"
                        >
                            <svg
                                className="h-5 w-5 transition-transform duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        {/* Modo compacto: só mostra o botão collapse centralizado */}
                        <button
                            onClick={handleCollapse}
                            className={`hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white ${
                                isCollapsed ? 'lg:block' : ''
                            }`}
                            aria-label="Toggle Sidebar"
                        >
                            <svg
                                className="h-5 w-5 transition-transform duration-300 rotate-180"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 overflow-x-hidden">
                        {navItems.map(({ path, label, icon }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={handleNavItemClick}
                                className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:gap-0' : 'gap-3'} px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                                    isActive(path)
                                        ? 'bg-blue-600/20 text-white'
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                                title={isCollapsed ? label : ''}
                            >
                                <span className="text-xl shrink-0">{icon}</span>
                                <span className={`font-medium transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                                    {label}
                                </span>
                                {isActive(path) && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r" />
                                )}
                                {isCollapsed && (
                                    <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-[#171d2e] text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                                        {label}
                                    </div>
                                )}
                            </Link>
                        ))}

                        {/* Settings */}
                        <Link
                            to="/configuracoes"
                            onClick={handleNavItemClick}
                            className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:gap-0' : 'gap-3'} px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                                isActive('/configuracoes')
                                    ? 'bg-blue-600/20 text-white'
                                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                            title={isCollapsed ? 'Configurações' : ''}
                        >
                            <span className="text-xl shrink-0">⚙️</span>
                            <span className={`font-medium transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                                Configurações
                            </span>
                            {isActive('/configuracoes') && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r" />
                            )}
                            {isCollapsed && (
                                <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-[#171d2e] text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                                    Configurações
                                </div>
                            )}
                        </Link>
                    </nav>

                    {/* User Section */}
                    <div className="border-t border-white/10 p-4">
                        <button
                            onClick={handleAuthAction}
                            className={`w-full flex cursor-pointer items-center ${isCollapsed ? 'lg:justify-center lg:gap-0' : 'gap-3'} px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                currentUser
                                    ? 'bg-red-600/80 hover:bg-red-600 text-white'
                                    : 'bg-blue-600/80 hover:bg-blue-600 text-white'
                            }`}
                        >
                            <span className="text-xl">{currentUser ? '🚪' : '🔐'}</span>
                            <span className={`transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                                {currentUser ? 'Sair' : 'Login'}
                            </span>
                        </button>
                        {currentUser && (
                            <div className={`mt-3 px-3 py-2 rounded-lg bg-white/5 transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                                <p className="text-xs text-gray-400 truncate">
                                    {currentUser.email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Spacer for content - adjusts based on sidebar state */}
            <div className={`hidden lg:block ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`} />
        </>
    );
}