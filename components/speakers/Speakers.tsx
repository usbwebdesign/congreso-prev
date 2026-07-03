'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Importación centralizada y limpia
import s from './Speakers.module.css';

interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string; 
  image_url: string;
  bio: string;
  linkedin_url?: string;
  x_url?: string;
  facebook_url?: string;
}

//  ICONOS SVGS PREDETERMINADOS (Estilo Apple, caja de 16px)
const SOCIAL_ICONS = {
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  ),
  x: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
    </svg>
  ),
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  )
};

export default function Speakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const SPEAKERS_PER_PAGE = 4;

  // LLAMADA A SUPABASE
  useEffect(() => {
    async function fetchSpeakers() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('speakers')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) setSpeakers(data);
      } catch (err) {
        console.error('Error cargando ponentes en el Home:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpeakers();
  }, []);

  // Bloqueo de scroll cuando la modal está abierta
  useEffect(() => {
    if (selectedSpeaker) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedSpeaker]);

  if (loading) {
    return (
      <section className={s.sectionContainer}>
        <div style={{ color: '#71717a', textAlign: 'center', padding: '60px', fontFamily: 'inherit' }}>
          Cargando ponentes...
        </div>
      </section>
    );
  }

  const totalPages = Math.ceil(speakers.length / SPEAKERS_PER_PAGE);
  const indexOfLastSpeaker = currentPage * SPEAKERS_PER_PAGE;
  const indexOfFirstSpeaker = indexOfLastSpeaker - SPEAKERS_PER_PAGE;
  const currentSpeakers = speakers.slice(indexOfFirstSpeaker, indexOfLastSpeaker);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <section className={s.sectionContainer} id="ponentes">
      
      {/* BARRA DE CONTROL SUPERIOR */}
      <div className={s.topControlBar}>
        <div className={s.paginationIndicator}>
          <span className={s.pageNumbers}>{currentPage} de {totalPages || 1}</span>
          <Link href="/ponentes" className={s.viewAllLink}>
            Ver todos los ponentes
            <ArrowUpRight size={16} className={s.arrowIcon} />
          </Link>
        </div>

        <div className={s.arrowControls}>
          <button 
            className={s.arrowButton} 
            onClick={prevPage} 
            disabled={currentPage === 1 || totalPages === 0}
            aria-label="Página anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className={s.arrowButton} 
            onClick={nextPage} 
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Página siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={s.header}>
        <h2 className={s.title}>Ponentes</h2>
        <h3 className={s.subtitle}>Aprende de los líderes de la industria</h3>
        <p className={s.description}>
          Escucha a expertos multidisciplinarios que están transformando 
          el entorno profesional con ideas disruptivas e innovación.
        </p>
      </div>

      {/* GRID DE TARJETAS DINÁMICAS */}
      <div className={s.gridWrapper}>
        <div key={currentPage} className={s.speakersGrid}>
          {currentSpeakers.map((speaker) => (
            <div 
              key={speaker.id} 
              className={s.card}
              onClick={() => setSelectedSpeaker(speaker)}
            >
              <div className={s.imageWrapper}>
                <Image 
                  src={speaker.image_url || '/images/speaker-placeholder.jpg'} 
                  alt={speaker.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  className={s.speakerImage}
                  priority
                />
                <div className={s.cardOverlay} />
              </div>

              <div className={s.cardContent}>
                <h4 className={s.speakerName}>{speaker.name}</h4>
                <p className={s.speakerRole}>
                  {speaker.role}{speaker.company ? `, ${speaker.company}` : ''}
                </p>
                
                {/* RENDERIZADO CONDICIONAL DE ICONOS EN LA TARJETA */}
                <div className={s.socials} onClick={(e) => e.stopPropagation()}>
                  {speaker.x_url && speaker.x_url.trim() !== '' && (
                    <a href={speaker.x_url} target="_blank" rel="noreferrer" className={s.iconCircle} aria-label="X">
                      {SOCIAL_ICONS.x}
                    </a>
                  )}
                  {speaker.linkedin_url && speaker.linkedin_url.trim() !== '' && (
                    <a href={speaker.linkedin_url} target="_blank" rel="noreferrer" className={s.iconCircle} aria-label="LinkedIn">
                      {SOCIAL_ICONS.linkedin}
                    </a>
                  )}
                  {speaker.facebook_url && speaker.facebook_url.trim() !== '' && (
                    <a href={speaker.facebook_url} target="_blank" rel="noreferrer" className={s.iconCircle} aria-label="Facebook">
                      {SOCIAL_ICONS.facebook}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL ORIGINAL CON REPLICA DE DATOS --- */}
      {selectedSpeaker && (
        <div className={s.modalOverlay} onClick={() => setSelectedSpeaker(null)}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={s.closeButton} onClick={() => setSelectedSpeaker(null)}>
              ✕
            </button>
            <div className={s.modalBody}>
              <div className={s.modalAvatarWrapper}>
                <Image 
                  src={selectedSpeaker.image_url || '/images/speaker-placeholder.jpg'} 
                  alt={selectedSpeaker.name}
                  width={100}
                  height={100}
                  className={s.modalAvatar}
                />
              </div>
              <h3 className={s.modalName}>{selectedSpeaker.name}</h3>
              <p className={s.modalRole}>
                {selectedSpeaker.role}{selectedSpeaker.company ? `, ${selectedSpeaker.company}` : ''}
              </p>
              
              {/* Redes condicionales replicadas dentro de la modal */}
              <div className={s.socials} style={{ justifyContent: 'center', marginTop: '12px', marginBottom: '4px', gap: '8px' }}>
                {selectedSpeaker.x_url && selectedSpeaker.x_url.trim() !== '' && (
                  <a href={selectedSpeaker.x_url} target="_blank" rel="noreferrer" className={s.iconCircle} aria-label="X">
                    {SOCIAL_ICONS.x}
                  </a>
                )}
                {selectedSpeaker.linkedin_url && selectedSpeaker.linkedin_url.trim() !== '' && (
                  <a href={selectedSpeaker.linkedin_url} target="_blank" rel="noreferrer" className={s.iconCircle} aria-label="LinkedIn">
                    {SOCIAL_ICONS.linkedin}
                  </a>
                )}
                {selectedSpeaker.facebook_url && selectedSpeaker.facebook_url.trim() !== '' && (
                  <a href={selectedSpeaker.facebook_url} target="_blank" rel="noreferrer" className={s.iconCircle} aria-label="Facebook">
                    {SOCIAL_ICONS.facebook}
                  </a>
                )}
              </div>

              <div className={s.divider} />
              <p className={s.modalBio}>{selectedSpeaker.bio}</p>
              <button className={s.modalCta} onClick={() => setSelectedSpeaker(null)}>
                Cerrar Perfil
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}