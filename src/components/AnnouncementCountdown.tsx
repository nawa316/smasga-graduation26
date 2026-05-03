'use client';

import { useEffect, useState } from 'react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

interface AnnouncementCountdownProps {
  onStateChange?: (isExpired: boolean) => void;
}

const ANNOUNCEMENT_TARGET_WIB = '2026-05-04T12:00:00+07:00';

export default function AnnouncementCountdown({
  onStateChange,
}: AnnouncementCountdownProps) {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const targetDate = new Date(ANNOUNCEMENT_TARGET_WIB);
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        onStateChange?.(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
      onStateChange?.(false);
    };

    // Calculate immediately
    calculateCountdown();

    // Update every second
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [onStateChange]);

  if (countdown.isExpired) {
    return null;
  }

  return (
    <div className='relative overflow-hidden rounded-[1.5rem] border border-[#f6dfb0]/40 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 shadow-[0_10px_30px_rgba(217,119,6,0.2)] backdrop-blur-sm mb-8'>
      <div className='text-center'>
        <h3 className='text-xl font-bold text-[#f6dfb0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] mb-4'>
          Pengumuman Kelulusan Akan Dimulai Dalam:
        </h3>
        <div className='grid grid-cols-4 gap-3'>
          {/* Days */}
          <div className='relative overflow-hidden rounded-lg border border-[#f6dfb0]/30 bg-[#06213a]/60 p-3 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#f6dfb0]/5 to-transparent' />
            <div className='relative'>
              <div className='text-3xl font-black text-[#f6dfb0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'>
                {String(countdown.days).padStart(2, '0')}
              </div>
              <div className='text-xs font-semibold text-white/70 uppercase tracking-wider mt-1'>
                Hari
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className='relative overflow-hidden rounded-lg border border-[#f6dfb0]/30 bg-[#06213a]/60 p-3 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#f6dfb0]/5 to-transparent' />
            <div className='relative'>
              <div className='text-3xl font-black text-[#f6dfb0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'>
                {String(countdown.hours).padStart(2, '0')}
              </div>
              <div className='text-xs font-semibold text-white/70 uppercase tracking-wider mt-1'>
                Jam
              </div>
            </div>
          </div>

          {/* Minutes */}
          <div className='relative overflow-hidden rounded-lg border border-[#f6dfb0]/30 bg-[#06213a]/60 p-3 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#f6dfb0]/5 to-transparent' />
            <div className='relative'>
              <div className='text-3xl font-black text-[#f6dfb0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'>
                {String(countdown.minutes).padStart(2, '0')}
              </div>
              <div className='text-xs font-semibold text-white/70 uppercase tracking-wider mt-1'>
                Menit
              </div>
            </div>
          </div>

          {/* Seconds */}
          <div className='relative overflow-hidden rounded-lg border border-[#f6dfb0]/30 bg-[#06213a]/60 p-3 shadow-[0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#f6dfb0]/5 to-transparent' />
            <div className='relative'>
              <div className='text-3xl font-black text-[#f6dfb0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'>
                {String(countdown.seconds).padStart(2, '0')}
              </div>
              <div className='text-xs font-semibold text-white/70 uppercase tracking-wider mt-1'>
                Detik
              </div>
            </div>
          </div>
        </div>
        <p className='text-sm text-white/75 mt-6'>
          Pengumuman hasil kelulusan bisa dibuka tanggal 4 Mei 2026 pukul 12:00
          WIB
        </p>
      </div>
    </div>
  );
}
