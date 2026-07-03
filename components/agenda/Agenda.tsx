'use client';

import React, { useState, useEffect } from 'react';
import { LogIn, Utensils, Radio, Coffee, LogOut, ChevronRight, X, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import styles from './Agenda.module.css';

interface AgendaEvent {
  id: string;
  day: number;
  time_start: string;
  time_end: string;
  title: string;
  type: 'welcome' | 'break' | 'conference' | 'catering' | 'closing';
  faculty: 'general' | 'FCH' | 'FCEAN' | 'FCYT' ;
  sort_order: number; // ✨ Campo numérico integrado para evitar el desorden alfabético
  speaker_name?: string;
  speaker_role?: string;
  bio?: string;
}

export default function Agenda() {
  const { user, loading: authLoading } = useAuth();
  const [activeDay, setActiveDay] = useState<number>(1);
  const [activeFaculty, setActiveFaculty] = useState<string>('general');
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchAgenda = async () => {
        try {
          setDbLoading(true);
          
          //  DOBLE ORDENAMIENTO NATIVO: Primero agrupa por día, luego por la secuencia cronológica real
          const { data, error } = await supabase
            .from('agenda_events')
            .select('*')
            .order('day', { ascending: true })
            .order('sort_order', { ascending: true });
          
          if (error) throw error;
          if (data) setEvents(data as AgendaEvent[]);
        } catch (error) {
          console.error('Error cargando la agenda filtrada:', error);
        } finally {
          setDbLoading(false);
        }
      };
      fetchAgenda();
    }
  }, [user, authLoading]);

  // Prevención de scroll de fondo con modales activos
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedEvent]);

  if (authLoading || !user) return null;

  // DOBLE FILTRADO ANIDADO: Por Día Y por Facultad (Siempre incluye los bloques 'general')
  const filteredEvents = events.filter(event => {
    const matchDay = event.day === activeDay;
    const matchFaculty = event.faculty === 'general' || event.faculty === activeFaculty;
    return matchDay && matchFaculty;
  });

  const renderLeftBlock = (type: AgendaEvent['type']) => {
    switch (type) {
      case 'welcome': return <div className={`${styles.iconBlock} ${styles.bgWelcome}`}><LogIn size={22} /></div>;
      case 'break': return <div className={`${styles.iconBlock} ${styles.bgBreak}`}><Utensils size={22} /></div>;
      case 'conference': return <div className={`${styles.iconBlock} ${styles.bgConference}`}><Radio size={22} /></div>;
      case 'catering': return <div className={`${styles.iconBlock} ${styles.bgCatering}`}><Coffee size={22} /></div>;
      case 'closing': return <div className={`${styles.iconBlock} ${styles.bgClosing}`}><LogOut size={22} /></div>;
    }
  };

  return (
    <section id='agenda' className={styles.sectionContainer}>
      <h2 className={styles.sectionTitle}>Agenda del Congreso</h2>

      {/* TIER 1: Selector de Día */}
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabButton} ${activeDay === 1 ? styles.tabActive : ''}`}
          onClick={() => setActiveDay(1)}
        >
          Día 1
        </button>
        <button 
          className={`${styles.tabButton} ${activeDay === 2 ? styles.tabActive : ''}`}
          onClick={() => setActiveDay(2)}
        >
          Día 2
        </button>
      </div>

      {/*  TIER 2 ANIDADO: Selector de Facultad */}
      <div className={styles.facultyFilterContainer}>
        <span className={styles.filterLabel}><Filter size={14} /> Filtrar por área:</span>
        <div className={styles.facultyChips}>
          {['general', 'FCH', 'FCEAN', 'FCYT'].map((fac) => (
            <button
              key={fac}
              className={`${styles.chipButton} ${activeFaculty === fac ? styles.chipActive : ''}`}
              onClick={() => setActiveFaculty(fac)}
            >
              {fac === 'general' ? 'Todo el Congreso' : fac.charAt(0).toUpperCase() + fac.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Línea de Tiempo */}
      {dbLoading ? (
        <div className={styles.loaderState}>Sincronizando cronograma multidisciplinario...</div>
      ) : filteredEvents.length === 0 ? (
        <div className={styles.emptyState}>No hay actividades programadas para este segmento.</div>
      ) : (
        <div className={styles.timeline}>
          {filteredEvents.map((event) => {
            const isConference = event.type === 'conference';
            return (
              <div 
                key={event.id} 
                className={`${styles.row} ${isConference ? styles.rowInteractive : ''}`}
                onClick={() => isConference && setSelectedEvent(event)}
              >
                {renderLeftBlock(event.type)}

                <div className={`${styles.infoCard} ${isConference ? styles.infoCardConference : ''}`}>
                  <div className={styles.cardHeader}>
                    <div>
                      {event.faculty !== 'general' && (
                        <span className={styles.facultyTag}>{event.faculty}</span>
                      )}
                      <h4 className={styles.eventTitle}>{event.title}</h4>
                      <p className={styles.eventTime}>{event.time_start} - {event.time_end}</p>
                    </div>
                    {isConference && (
                      <button className={styles.detailsBtn}>
                        Ver detalles <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                  {isConference && event.speaker_name && (
                    <p className={styles.speakerTag}>
                      {event.speaker_name} — <span className={styles.roleSub}>{event.speaker_role}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL DETALLE CONFERENCIA --- */}
      {selectedEvent && selectedEvent.type === 'conference' && (
        <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedEvent(null)}>
              <X size={18} />
            </button>
            <div className={styles.modalHeader}>
              <span className={styles.modalLabel}>Detalles de la Ponencia</span>
              <h3 className={styles.modalTitle}>{selectedEvent.title}</h3>
              <p className={styles.modalTimeSlot}>Horario: {selectedEvent.time_start} a {selectedEvent.time_end}</p>
            </div>
            <div className={styles.modalBody}>
              <h4 className={styles.modalSpeakerTitle}>Expositor</h4>
              <p className={styles.modalSpeakerName}>
                {selectedEvent.speaker_name} <span className={styles.modalSpeakerRole}>({selectedEvent.speaker_role})</span>
              </p>
              <p className={styles.modalBioText}>{selectedEvent.bio}</p>
              <button className={styles.modalCloseCta} onClick={() => setSelectedEvent(null)}>Volver al cronograma</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}