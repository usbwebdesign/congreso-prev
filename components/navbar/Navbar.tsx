"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircle, Key, CheckCircle2 } from 'lucide-react'; 
import { useAuth } from '@/hooks/useAuth'; 
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import RegistrationModal from '../modal/RegistrationModal'; 
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); 
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const { user, loading } = useAuth(); 

  useEffect(() => {
    const logoutParam = searchParams.get('logout');
    
    if (logoutParam === 'true') {
      const openTimer = setTimeout(() => {
        setShowLogoutToast(true);
        window.history.replaceState({}, '', '/');
      }, 50);

      const closeTimer = setTimeout(() => {
        setShowLogoutToast(false);
      }, 3400);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [searchParams]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleOpenRegisterModal = () => {
    setIsRegisterOpen(true);
    setIsMenuOpen(false); 
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    
    router.push('/?logout=true');
    
    setTimeout(() => {
      router.refresh();
    }, 100);
  };

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navContainer}>
          {/* LADO IZQUIERDO: Logo */}
          <Link href="/" className={styles.logoSection}>
            <Image 
              src="/images/universidadsimonbolivarlogo.webp" 
              alt="USB Online Logo" 
              className={styles.logoImage} 
              width={160}
              height={40} 
              priority
            />
          </Link>

          {/* CENTRO: Menú de navegación */}
          <ul className={`${styles.menuLinks} ${isMenuOpen ? styles.menuOpen : ''}`}>
            <li>
              <Link href="/#inicio" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/#evento" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                Evento
              </Link>
            </li>
            <li>
              <Link href="/#ponentes" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                Ponentes
              </Link>
            </li>
            
            {!loading && user && (
              <li>
                <Link href="/#agenda" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                  Agenda
                </Link>
              </li>
            )}

            {!loading && user && (
              <li>
                <Link href="/#streaming" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                  Streaming
                </Link>
              </li>
            )}

            <li>
              <Link href="/#acceso" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                Acceso
              </Link>
            </li>
            
            {!loading && (
              user ? (
                <li className={styles.mobileOnly}>
                  <button onClick={handleLogout} className={styles.link} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}>
                    Cerrar Sesión
                  </button>
                </li>
              ) : (
                <>
                  <li className={styles.mobileOnly}>
                    <button onClick={handleOpenRegisterModal} className={styles.link} style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}>
                      Registro e Informes
                    </button>
                  </li>
                  <li className={styles.mobileOnly}>
                    <Link href="/login" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                      Iniciar Sesión
                    </Link>
                  </li>
                </>
              )
            )}
          </ul>

          {/* LADO DERECHO: Acciones */}
          <div className={styles.actions}>
            {!loading && (
              user ? (
                <div className={styles.userAuthenticatedGroup}>
                  <div className={styles.userIconProfile}>
                    <UserCircle size={18} strokeWidth={2} />
                    <span className={styles.userEmailBadge}>{user.email?.split('@')[0]}</span>
                  </div>

                  <button 
                    onClick={handleLogout} 
                    className={styles.btnCerrarSesion}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <>
                  {/* Pill de Login con icono de llave */}
                  <Link 
                    href="/login" 
                    className={styles.btnLoginPill} 
                  >
                    <Key size={16} strokeWidth={2.2} />
                    <span className={styles.btnText}>Iniciar Sesión</span>
                  </Link>

                  <button 
                    onClick={handleOpenRegisterModal} 
                    className={styles.btnAdmisiones}
                  >
                    Registro
                  </button>
                </>
              )
            )}

            <button className={styles.hamburger} onClick={toggleMenu} aria-label="Menu">
              <div className={`${styles.bar} ${isMenuOpen ? styles.bar1 : ''}`}></div>
              <div className={`${styles.bar} ${isMenuOpen ? styles.bar2 : ''}`}></div>
              <div className={`${styles.bar} ${isMenuOpen ? styles.bar3 : ''}`}></div>
            </button>
          </div>
        </nav>
      </header>

      {showLogoutToast && (
        <div className={styles.toastNotification}>
          <CheckCircle2 size={16} className={styles.toastIcon} />
          <span>Sesión cerrada correctamente</span>
        </div>
      )}

      <RegistrationModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </>
  );
};

export default Navbar;