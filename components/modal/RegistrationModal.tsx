'use client';

import React, { useState } from 'react';
import { X, Calendar, CreditCard, Receipt, Phone, Copy, Check, SlidersHorizontal } from 'lucide-react';
import s from './RegistrationModal.module.css';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Category = 'licenciatura' | 'posgrado';
type Month = 'Marzo' | 'Abril' | 'Mayo' | 'Junio' | 'Julio' | 'Agosto' | 'Septiembre' | 'Octubre';

// Arreglo maestro de meses disponibles para el cálculo
const ALL_MONTHS: Month[] = ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'];

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('licenciatura');
  
  // Guardamos el índice del mes en el que el usuario quiere empezar a pagar
  const [startMonthIndex, setStartMonthIndex] = useState<number>(0); 
  
  const clabeNumber = "072180000996261432";

  if (!isOpen) return null;

  const handleCopyClabe = async () => {
    try {
      await navigator.clipboard.writeText(clabeNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar la CLABE', err);
    }
  };

  // 1. Definición de Totales base e Inscripción base
  const totalAmount = activeCategory === 'licenciatura' ? 1950 : 1000;
  
  // La inscripción base (si empieza en Marzo) es 450 para lic y 250 para posgrado
  const baseInscription = activeCategory === 'licenciatura' ? 450 : 250;

  // 2. MOTOR DE CÁLCULO DINÁMICO
  // Filtramos los meses restantes desde el mes seleccionado
  const remainingMonths = ALL_MONTHS.slice(startMonthIndex);
  const totalPaymentsCount = remainingMonths.length;

  interface PaymentSchedule {
    month: Month;
    amount: string;
    desc?: string;
  }

const calculatedPayments: PaymentSchedule[] = [];

  if (totalPaymentsCount === 1) {
    // Si solo queda Octubre, se liquida el total de un solo golpe
    calculatedPayments.push({
      month: remainingMonths[0],
      amount: `$${totalAmount.toLocaleString()}`,
      desc: 'Liquidación Total'
    });
  } else {
    // Si hay más meses, respetamos una proporción donde el primer mes es Inscripción (más alto)
    // Ajustamos la inscripción para que no desfase el resto si se inscriben muy tarde
    const inscription = totalPaymentsCount >= 6 ? baseInscription : Math.round(totalAmount * 0.3);
    const restTotal = totalAmount - inscription;
    const standardPayment = Math.round(restTotal / (totalPaymentsCount - 1));

    remainingMonths.forEach((month, idx) => {
      if (idx === 0) {
        calculatedPayments.push({
          month,
          amount: `$${inscription.toLocaleString()}`,
          desc: 'Inscripción'
        });
      } else if (idx === totalPaymentsCount - 1) {
        // El último mes ajusta los decimales o diferencias de redondeo
        const accumulated = inscription + (standardPayment * (totalPaymentsCount - 2));
        const lastPayment = totalAmount - accumulated;
        calculatedPayments.push({
          month,
          amount: `$${lastPayment.toLocaleString()}`
        });
      } else {
        calculatedPayments.push({
          month,
          amount: `$${standardPayment.toLocaleString()}`
        });
      }
    });
  }

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.grainTexture} aria-hidden="true" />
      
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={s.closeButton} onClick={onClose} aria-label="Cerrar ventana">
          <X size={18} />
        </button>

        <div className={s.header}>
          <span className={s.anniversaryBadge}>45 Aniversario</span>
          <h2 className={s.eventTitle}>V Congreso Multidisciplinario USBMéxico 2026</h2>
          <p className={s.organizer}>Organiza: Universidad Simón Bolívar (USB México)</p>
          <div className={s.mottoWrapper}>
            <span className={s.motto}>“Innovar para transformar”</span>
          </div>
        </div>

        <div className={s.scrollableBody}>
          
          {/* SECCIÓN 1: COSTO Y FINANCIAMIENTO */}
          <section className={s.section}>
            <div className={s.sectionTitleWrapper}>
              <Calendar size={18} className={s.iconBlue} />
              <h3>Costo y Financiamiento</h3>
            </div>
            
            {/* Tabs de Categoría */}
            <div className={s.tabContainer}>
              <button 
                type="button"
                className={`${s.tabButton} ${activeCategory === 'licenciatura' ? s.tabActive : ''}`}
                onClick={() => setActiveCategory('licenciatura')}
              >
                Licenciatura
              </button>
              <button 
                type="button"
                className={`${s.tabButton} ${activeCategory === 'posgrado' ? s.tabActive : ''}`}
                onClick={() => setActiveCategory('posgrado')}
              >
                Posgrado
              </button>
            </div>

            {/* CONTROL AJUSTADOR DINÁMICO (UX Premium) */}
            <div className={s.adjusterCard}>
              <div className={s.adjusterHeader}>
                <SlidersHorizontal size={14} className={s.iconBlue} />
                <span>¿Cuándo realizarás tu primer pago?</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={ALL_MONTHS.length - 1} 
                value={startMonthIndex}
                onChange={(e) => setStartMonthIndex(parseInt(e.target.value))}
                className={s.rangeSlider}
              />
              <div className={s.currentMonthIndicator}>
                Iniciando en: <strong>{ALL_MONTHS[startMonthIndex]}</strong> ({totalPaymentsCount} {totalPaymentsCount === 1 ? 'pago' : 'pagos restantes'})
              </div>
            </div>
            
            <div className={s.totalCostBlock}>
              <span className={s.totalLabel}>Costo total ({activeCategory})</span>
              <span className={s.totalAmount}>${totalAmount.toLocaleString()} MXN</span>
            </div>

            <p className={s.sectionSubtitle}>Plan de pagos personalizado:</p>
            <div className={s.paymentsGrid}>
              {calculatedPayments.map((p, index) => (
                <div key={p.month} className={`${s.paymentCard} ${p.desc ? s.paymentCardActive : ''}`}>
                  <span className={s.paymentMonth}>{index + 1}º {p.month}</span>
                  <span className={s.paymentAmount}>{p.amount}</span>
                  {p.desc && <span className={s.paymentConcept}>{p.desc}</span>}
                </div>
              ))}
            </div>
          </section>

          {/* SECCIÓN 2: MODALIDADES DE PAGO */}
          <section className={s.section}>
            <div className={s.sectionTitleWrapper}>
              <CreditCard size={18} className={s.iconBlue} />
              <h3>Modalidades de Pago</h3>
            </div>

            <div className={s.methodsContainer}>
              <div className={s.methodBlock}>
                <h4>1. Pago en efectivo</h4>
                <p><strong>Lugar:</strong> Depto. de Educación Continua</p>
                <div className={s.scheduleBlock}>
                  <span><strong>Lunes a Viernes:</strong> 9:00 a 17:30 h</span>
                  <span><strong>Sábados:</strong> 9:00 a 13:00 h</span>
                </div>
              </div>

              <div className={s.methodBlock}>
                <h4>2. Pago por transferencia</h4>
                <div className={s.bankDetailsCard}>
                  <div className={s.bankRow}>
                    <span className={s.bankLabel}>Banco</span>
                    <span className={s.bankValue}>BANORTE</span>
                  </div>
                  <div className={s.bankRow}>
                    <span className={s.bankLabel}>Cuenta</span>
                    <span className={s.bankValue}>0099626143</span>
                  </div>
                  <div className={s.bankRow}>
                    <span className={s.bankLabel}>Titular</span>
                    <span className={s.bankValue}>Centros Culturales, S.C.</span>
                  </div>
                  <div className={s.bankRowClabe}>
                    <div className={s.clabeTextWrapper}>
                      <span className={s.bankLabel}>CLABE</span>
                      <span className={s.clabeValue}>{clabeNumber}</span>
                    </div>
                    <button 
                      type="button" 
                      className={`${s.copyButton} ${copied ? s.copyButtonSuccess : ''}`}
                      onClick={handleCopyClabe}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: ENVÍO DE COMPROBANTE */}
          <section className={s.section}>
            <div className={s.sectionTitleWrapper}>
              <Receipt size={18} className={s.iconBlue} />
              <h3>Envío de Comprobante</h3>
            </div>
            <p className={s.infoText}>
              Una vez realizado tu pago, es obligatorio enviar el comprobante incluyendo tu <strong>Nombre completo</strong> y el <strong>Concepto de pago</strong> (asegúrate de que el documento cuente con código de rastreo).
            </p>
            <div className={s.channelsGrid}>
              <a href="mailto:educon1@usb.edu.mx" className={s.channelLink}>
                <span className={s.channelLabel}>Correo electrónico</span>
                <span className={s.channelValue}>educon1@usb.edu.mx</span>
              </a>
              <a href="https://wa.me/525530321684" target="_blank" rel="noopener noreferrer" className={s.channelLink}>
                <span className={s.channelLabel}>WhatsApp</span>
                <span className={s.channelValue}>55 3032 1684</span>
              </a>
            </div>
          </section>

          <footer className={s.modalFooter}>
            <div className={s.contactRow}>
              <Phone size={14} />
              <span>¿Dudas o aclaraciones? Teléfono de contacto: <strong>55 5629 9724</strong></span>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}