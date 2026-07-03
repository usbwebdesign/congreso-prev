'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import dynamic from 'next/dynamic';
import RegistrationModal from '../modal/RegistrationModal'; // Ajusta la ruta relativa según tu árbol

const CountdownNoSSR = dynamic(() => import('../countdown/Countdown'), {
  ssr: false,
});

export default function Hero() {
  // Estado local para abrir/cerrar el desglose de pagos e informes
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
      {/* Conservamos tu id='inicio' que conecta con el Navbar */}
      <section id='inicio' className={styles.heroContainer}>
        
        {/* 1. IMAGEN DE FONDO Y OVERLAYS OPTIMIZADOS */}
        <div className={styles.backgroundImageWrapper}>
          <Image 
            src="/images/hero-bg.webp" 
            alt="V Congreso Multidisciplinario Background"
            fill
            priority
            sizes="100vw"
            className={styles.bgImage}
          />
          <div className={styles.overlayGradient} />
        </div>

        {/* 2. CONTENIDO CENTRAL (LOGO, CONTADOR, CTA) */}
        <div className={styles.content}>
          <div className={styles.logoWrapper}>
            <Image 
              src="/images/logo-congreso.svg" 
              alt="5to Congreso Multidisciplinario" 
              width={500}
              height={220}
              priority
              className={styles.logo} 
            />
          </div>

          <CountdownNoSSR />

          {/* REAJUSTE: Regresamos a <button> con el evento onClick del modal */}
          <button 
            type="button"
            onClick={() => setIsRegisterOpen(true)} 
            className={styles.ctaButton}
          >
            Asegura tu lugar
          </button>
        </div>

        {/* 3. REAJUSTE: Cambiado de <div> a <a> para que la flecha realmente haga scroll */}
        <a href="#oferta" className={styles.scrollArrow} aria-label="Ir a la siguiente sección">
          <svg 
            width="34" 
            height="34" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path 
              d="M7 13l5 5 5-5M7 6l5 5 5-5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </section>

      {/* MODAL INFORMATIVO DE REGISTRO */}
      <RegistrationModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </>
  );
}