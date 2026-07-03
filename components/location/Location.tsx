'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import styles from './Location.module.css';

/* =============================================================================
📌 BLUEPRINT / PROMPT PARA DRIVER DE CALENDARIO Y MAPAS
=============================================================================
... (Tu blueprint se mantiene igual)
*/

export default function Location() {
  // Enlace real de redirección para abrir en la app/web de Google Maps
  const googleMapsUrl = 'https://maps.google.com/?q=Le+Crillon+Av.+Cuauhtémoc+1438+CDMX';
  
  // URL de inserción (Embed) para el iframe interactivo
  const googleMapsEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.0694579207075!2d-99.16453652389166!3d19.36614494279821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ffb94c477ff9%3A0x9dec9a1ec05ad4ee!2sLe%20Crillon!5e0!3m2!1ses-419!2smx!4v1781135444121!5m2!1ses-419!2smx"';

  // URL para inyectar el evento directamente en el Google Calendar
  const googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=V+Congreso+Multidisciplinario+USBOnline&dates=20261106T150000Z/20261108T000000Z&details=Aprende+de+los+l%C3%ADderes+de+la+industria.&location=Le+Crillon,+Av.+Cuauht%C3%A9moc+1438,+Sta+Cruz+Atoyac,+CDMX';

  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.sectionTitle}>¿Dónde se llevará a cabo?</h2>

      {/* Grid Principal Bento */}
      <div className={styles.bentoGrid}>
        
        {/* Tarjeta 1: Dirección y Mapa */}
        <div className={styles.cardVenue}>
          <div className={styles.venueInfo}>
            <h3 className={styles.venueName}>Le Crillon</h3>
            <p className={styles.venueAddress}>
              Av. Cuauhtémoc 1438, Sta Cruz Atoyac, Benito Juárez, 03310 Ciudad de México, CDMX
            </p>
          </div>
          
          {/* Contenedor del Mapa Interactivo Real */}
          <div className={styles.mapContainer} style={{ position: 'relative', overflow: 'hidden' }}>
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Le Crillon en Google Maps"
            ></iframe>
            
            {/* Mantenemos el botón flotante por si el usuario prefiere abrirlo en pantalla completa / app móvil */}
            <div className={styles.mapOverlay} style={{ pointerEvents: 'none' }}>
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.mapButton}
                style={{ pointerEvents: 'auto' }} // Permite hacer clic en el botón sobre el mapa
              >
                Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Fachada / Fotografía del Recinto */}
        <div className={styles.cardImage}>
          <Image 
            src="/images/venue-facade.webp"
            alt="Instalaciones del evento"
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
            className={styles.facadeImage}
          />
        </div>

        {/* Tarjeta 3: Bloque de Fechas Horizontal Completo */}
        <div className={styles.cardDates}>
          <div className={styles.dateMeta}>
            <h4 className={styles.dateLabel}>Días</h4>
            <p className={styles.dateDays}>6 y 7 de Noviembre</p>
            
            <div className={styles.timeRow}>
              <div className={styles.calendarIconWrapper}>
                <Calendar size={20} />
              </div>
              <div>
                <p className={styles.timeRange}>9:00 am - 6:00 pm</p>
                <p className={styles.timeZone}>(Hora CDMX)</p>
              </div>
            </div>
          </div>

          <a 
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.calendarCta}
          >
            Agendar en Calendar
          </a>
        </div>

      </div>
    </section>
  );
}