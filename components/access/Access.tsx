'use client';

import React, { useState } from 'react';
import styles from './Access.module.css';
import RegistrationModal from '../modal/RegistrationModal'; // Ajusta la ruta si es necesario

interface TicketPlan {
  id: string;
  type: 'licenciatura' | 'posgrado';
  title: string;
  benefits: {
    label: string;
    description: string;
  }[];
}

const ticketPlans: TicketPlan[] = [
  {
    id: 't1',
    type: 'licenciatura',
    title: 'Licenciatura',
    benefits: [
      { label: 'Acceso Total:', description: 'Entrada a todas las conferencias y paneles en vivo.' },
      { label: 'Kit de Bienvenida:', description: 'Material pop, bolso oficial y acreditación física.' },
      { label: 'Coffee Break & Networking:', description: 'Espacios dedicados para conectar con ponentes y empresas.' },
      { label: 'Certificado Impreso:', description: 'Avalado por la Universidad Simón Bolívar.' },
      { label: 'Grabaciones Post-Evento:', description: 'Acceso a la plataforma para ver las charlas después.' }
    ]
  },
  {
    id: 't2',
    type: 'posgrado',
    title: 'Posgrado',
    benefits: [
      { label: 'Streaming HD:', description: 'Acceso en tiempo real a ponencias vía USBNetwork.' },
      { label: 'Preguntas en Vivo:', description: 'Chat interactivo para participar en las rondas de Q&A.' },
      { label: 'Material Descargable:', description: 'Acceso a las presentaciones y recursos de los ponentes.' },
      { label: 'Certificado Digital:', description: 'Descargable con código de verificación QR.' },
      { label: 'Grabaciones Post-Evento:', description: 'Acceso a la plataforma para ver las charlas después.' }
    ]
  }
];

export default function Access() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  // Almacenamos el plan seleccionado para pasárselo al modal si quisiéramos forzar la tab inicial
  const [initialCategory, setInitialCategory] = useState<'licenciatura' | 'posgrado'>('licenciatura');

  const handlePurchase = (type: 'licenciatura' | 'posgrado') => {
    setInitialCategory(type);
    setIsRegisterOpen(true);
  };

  return (
    <>
      <section id='acceso' className={styles.sectionContainer}>
        
        {/* Sección Solicitada: Acceso */}
        <div className={styles.accessHeader}>
          <h2 className={styles.accessTitle}>Acceso</h2>
          <div className={styles.accentLine} />
        </div>

        {/* Bloque de Contexto (Crecimiento Profesional) */}
        <div className={styles.growthHeader}>
          <h3 className={styles.growthTitle}>Diseñado para tu crecimiento profesional</h3>
          <p className={styles.growthSubtitle}>
            Consulta las actividades, materiales y dinámicas preparadas para ti, 
            de acuerdo a tu nivel de estudios en la universidad.
          </p>
        </div>

        {/* Contenedor de las Cards de Acceso */}
        <div className={styles.cardsGrid}>
          {ticketPlans.map((plan) => (
            <div key={plan.id} className={styles.ticketCard}>
              <h4 className={`${styles.planTitle} ${styles[plan.type]}`}>
                {plan.title}
              </h4>
              
              <ul className={styles.benefitsList}>
                {plan.benefits.map((benefit, index) => (
                  <li key={index} className={styles.benefitItem}>
                    <p className={styles.benefitText}>
                      <strong className={styles.benefitLabel}>{benefit.label}</strong>{' '}
                      {benefit.description}
                    </p>
                  </li>
                ))}
              </ul>

              {/* UX REFORZADA: Un botón dedicado por cada tarjeta para preseleccionar la categoría */}
              <button 
                type="button"
                className={styles.cardCtaButton}
                onClick={() => handlePurchase(plan.type)}
              >
                Ver plan de pagos
              </button>
            </div>
          ))}
        </div>

        {/* Botón Central de Acción General */}
        <div className={styles.actionWrapper}>
          <button 
            type="button"
            className={styles.ctaButton}
            onClick={() => handlePurchase('licenciatura')}
          >
            Adquirir Entradas
          </button>
        </div>

      </section>

      {/* MODAL INFORMATIVO DE REGISTRO CON SOPORTE DINÁMICO */}
      <RegistrationModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </>
  );
}