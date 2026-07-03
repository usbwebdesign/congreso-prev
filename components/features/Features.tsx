'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Features.module.css';

// Estructura de datos para modularizar el contenido de las tarjetas y la modal
interface FeatureItem {
  id: string;
  title: string;
  description: string;
  image: string;
  detailedContent: string;
}

const featuresData: FeatureItem[] = [
  {
    id: 'tendencias',
    title: 'Tendencias Aplicadas',
    description: 'Una experiencia integral que combina las últimas tendencias globales.',
    image: '/images/features-tendencias.webp',
    detailedContent: 'Explora a fondo tecnologías emergentes, inteligencia artificial aplicada al desarrollo de productos y metodologías ágiles que están transformando la industria tecnológica global este año.'
  },
  {
    id: 'expertos',
    title: 'Interacción con expertos',
    description: 'Aprendizaje práctico de la mano de expertos de la industria.',
    image: '/images/features-experto.webp',
    detailedContent: 'Mesas redondas exclusivas, sesiones de preguntas y respuestas en tiempo real, y espacios de mentoría uno a uno con líderes técnicos y diseñadores de producto de alto nivel.'
  },
  {
    id: 'conferencias',
    title: 'Conferencias en vivo',
    description: 'Transmisiones magistrales de alto impacto.',
    image: '/images/features-conferencias.webp',
    detailedContent: 'Acceso total a las ponencias principales transmitidas en alta definición. Incluye paneles de debate multidisciplinarios, análisis de casos reales de éxito y certificaciones curriculares digitales.'
  }
];

export default function Features() {
  const [activeCard, setActiveCard] = useState<FeatureItem | null>(null);

  // Bloquear el scroll de la página de fondo cuando la modal esté abierta
  useEffect(() => {
    if (activeCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeCard]);

  return (
    <section id='evento' className={styles.sectionContainer}>
      {/* Encabezado */}
      <div className={styles.header}>
        <h2 className={styles.title}>¿Qué encontrarás en este evento?</h2>
        <h3 className={styles.subtitle}>Una nueva forma de conectar</h3>
        <p className={styles.description}>
          Una experiencia integral que combina las últimas tendencias globales 
          con el aprendizaje práctico de la mano de expertos de la industria.
        </p>
      </div>

      {/* Grid de Tarjetas */}
      <div className={styles.gridContainer}>
        {featuresData.map((item) => {
          const isFullWidth = item.id === 'conferencias';
          return (
            <div 
              key={item.id}
              className={`${styles.card} ${isFullWidth ? styles.cardFullWidth : ''}`}
              onClick={() => setActiveCard(item)}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={item.image} 
                  alt={item.title}
                  fill
                  sizes={isFullWidth ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                  className={styles.cardImage}
                />
                <div className={styles.cardOverlay} />
              </div>
              <div className={isFullWidth ? styles.cardContentCentric : styles.cardContent}>
                <h4 className={isFullWidth ? styles.cardTitleLarge : styles.cardTitle}>
                  {item.title}
                </h4>
                <button className={styles.cardButton}>Más información</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODAL DETALLE CARD --- */}
      {activeCard && (
        <div className={styles.modalOverlay} onClick={() => setActiveCard(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setActiveCard(null)} aria-label="Cerrar">
              ✕
            </button>
            <div className={styles.modalImageWrapper}>
              <Image 
                src={activeCard.image} 
                alt={activeCard.title}
                fill
                className={styles.modalImage}
              />
              <div className={styles.modalImageOverlay} />
              <h3 className={styles.modalTitle}>{activeCard.title}</h3>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>{activeCard.detailedContent}</p>
              <button className={styles.modalCta} onClick={() => setActiveCard(null)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}