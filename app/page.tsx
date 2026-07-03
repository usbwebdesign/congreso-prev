import { Suspense } from 'react';
import nextDynamic from 'next/dynamic'; // 1. Le cambiamos el nombre aquí para evitar el conflicto
import Navbar from '@/components/navbar/Navbar';
import Hero from '@/components/hero/Hero';
import Features from '@/components/features/Features'; 
import HistoryTimeline from '@/components/timeline/HistoryTimeline'; 
import Access from '@/components/access/Access';
import Location from '@/components/location/Location';
import Footer from '@/components/footer/Footer';
import s from './HomePage.module.css'; 

// 2. Ahora sí puedes exportar tu constante sin romper nada
export const dynamic = "force-dynamic";

// 3. Usamos el nuevo nombre alias
const Speakers = nextDynamic(() => import('@/components/speakers/Speakers'));
const Agenda = nextDynamic(() => import('@/components/agenda/Agenda'));
const Streaming = nextDynamic(() => import('@/components/streaming/StreamingSection'));

function PreviewsSkeleton() {
  return (
    <div className={s.skeletonWrapper}>
      <div className={s.skeletonHeroTitle}></div>
      <div className={s.skeletonHeroSubtitle}></div>
      <div className={s.skeletonBadge}></div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PreviewsSkeleton />}>
        <main className={s.homeWrapper}>
          <div className={s.contentContainer}>
            <Hero />
            <Features /> 
            <HistoryTimeline /> 
            <Speakers />
            <Agenda />
            <Streaming />
            <Access />
            <Location />
          </div>
        </main>
      </Suspense>
      <Footer />
    </>
  );
}