'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import AnnouncementCountdown from '@/components/AnnouncementCountdown';

import studentsData from '~/data/students.json';

export type Student = {
  nisn: string;
  name: string;
};

export default function GraduationPage() {
  const students = studentsData.students as Student[];
  const [nis, setNis] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const [certificateRevealed, setCertificateRevealed] = useState(false);
  const [isCountdownExpired, setIsCountdownExpired] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (foundStudent && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Handle audio play error silently
      });
    }
  }, [foundStudent]);

  useEffect(() => {
    if (!foundStudent) {
      setCertificateRevealed(false);
      return;
    }

    setCertificateRevealed(false);
    const revealTimer = window.setTimeout(() => {
      setCertificateRevealed(true);
    }, 180);

    return () => window.clearTimeout(revealTimer);
  }, [foundStudent]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFoundStudent(null);

    if (!nis.trim()) {
      setError('Masukkan NISN Anda');
      return;
    }

    const student = students.find(
      (s) => s.nisn.toLowerCase() === nis.toLowerCase().trim()
    );

    if (student) {
      setFoundStudent(student);
    } else {
      setError('NISN tidak ditemukan');
      setNis('');
    }
  };

  const handleReset = () => {
    setNis('');
    setFoundStudent(null);
    setError('');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className='min-h-screen bg-[#001f3f] py-8 px-4 flex flex-col'
      style={{
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className='mx-auto w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/20 bg-[#001f3f]/92 shadow-[0_10px_26px_rgba(0,0,0,0.2)] sm:shadow-[0_28px_90px_rgba(0,0,0,0.35)] sm:backdrop-blur-sm'>
        <div className='bg-transparent px-4 py-6 sm:px-6 lg:px-8'>
          {/* Audio Element */}
          <audio ref={audioRef} loop>
            <source src='/audio/mars.mp3' type='audio/mpeg' />
          </audio>

          {/* Header - Always at Top */}
          <div className='mb-8'>
            <div className='relative overflow-hidden rounded-[1.75rem] border border-transparent bg-[#06213a] p-4 shadow-[0_6px_16px_rgba(0,0,0,0.14)] sm:p-5 sm:shadow-[0_10px_26px_rgba(0,0,0,0.18)] md:p-6'>
              {/* Opaque header background to prevent patterned background from showing through and causing banding */}

              <div className='relative flex items-center justify-between gap-4'>
                <div className='flex-shrink-0'>
                  <Image
                    src='/images/logo-smasga.png'
                    alt='Logo SMASGA'
                    width={128}
                    height={128}
                    priority
                    className='h-24 w-24 drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)] md:h-28 md:w-28'
                  />
                </div>

                <div className='flex-1 text-center'>
                  <h1 className='mt-2 text-2xl font-black tracking-[0.08em] leading-tight text-[#f7e1b2] break-words drop-shadow-[0_1px_6px_rgba(0,0,0,0.28)] sm:text-3xl sm:tracking-[0.14em] md:text-5xl md:tracking-[0.22em]'>
                    SMASGA JUARA
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex min-h-[calc(100vh-11rem)] flex-col'>
            {!foundStudent ? (
              // Search Form - Centered View
              <div className='flex-1 flex flex-col items-center justify-center'>
                <div className='max-w-4xl w-full'>
                  {/* Main Header */}
                  <div className='text-center mb-8'>
                    <h2 className='text-2xl font-bold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] mb-2 sm:text-4xl'>
                      Pengumuman Kelulusan
                    </h2>
                    <p className='text-sm text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)] mb-1 sm:text-xl'>
                      SMA Negeri 1 Tenggarang
                    </p>
                    <p className='text-xs text-[#f6dfb0] font-semibold leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)] mb-4 sm:text-lg'>
                      Berkarakter, Berprestasi, dan Kompetitif
                    </p>
                  </div>

                  {/* Countdown */}
                  <AnnouncementCountdown
                    onStateChange={setIsCountdownExpired}
                  />
                  {/* Search Form - Only show when countdown is expired */}
                  {isCountdownExpired && (
                    <div className='bg-[#06213a]/95 rounded-[1.5rem] border border-[#f6dfb0]/20 shadow-lg p-5 mb-8 backdrop-blur-sm sm:p-8'>
                      <form onSubmit={handleSearch} className='space-y-4'>
                        <div>
                          <label
                            htmlFor='nis'
                            className='block text-sm font-medium text-[#f6dfb0] mb-2'
                          >
                            Nomor Induk Siswa Nasional (NISN)
                          </label>
                          <input
                            type='text'
                            id='nis'
                            value={nis}
                            onChange={(e) => setNis(e.target.value)}
                            placeholder='Masukkan NISN Anda...'
                            className='w-full px-4 py-2 border border-[#f6dfb0]/30 rounded-lg bg-white/90 focus:ring-2 focus:ring-[#f6dfb0] focus:border-transparent outline-none text-slate-800'
                            autoFocus
                          />
                        </div>
                        {error && (
                          <p className='text-amber-300 text-sm'>{error}</p>
                        )}
                        <button
                          type='submit'
                          className='w-full bg-gradient-to-r from-[#f6dfb0] to-[#e8c858] text-[#06213a] py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition'
                        >
                          Lihat Hasil
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Certificate View - Normal Layout
              <div className='max-w-4xl mx-auto w-full'>
                {/* Countdown */}
                <AnnouncementCountdown />

                {/* Certificate */}
                <div className='space-y-6'>
                  <div className='relative overflow-hidden rounded-[2rem] border border-[#f6dfb0]/40 bg-gradient-to-br from-[#06213a]/20 to-[#0f3354]/20 p-3 shadow-[0_10px_28px_rgba(6,33,58,0.2)] sm:p-4 sm:shadow-[0_24px_80px_rgba(6,33,58,0.35)] sm:backdrop-blur-sm'>
                    <div
                      className={`relative rounded-[1.5rem] border border-[#f6dfb0]/50 bg-gradient-to-b from-[#fffdf7] to-[#fff7ea] px-4 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8),_0_1px_4px_rgba(6,33,58,0.1)] transition-all duration-500 ease-out sm:px-6 sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),_0_2px_8px_rgba(6,33,58,0.15)] md:p-12 md:duration-700 ${
                        certificateRevealed
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-4'
                      }`}
                    >
                      <div className='pointer-events-none absolute inset-0 overflow-hidden rounded-[1.5rem]'>
                        <div
                          className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#6a3518] via-[#9d5625] to-[#d8a05c] opacity-95 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:duration-1000 ${
                            certificateRevealed
                              ? '-translate-x-[105%]'
                              : 'translate-x-0'
                          }`}
                        />
                        <div
                          className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#6a3518] via-[#9d5625] to-[#d8a05c] opacity-95 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:duration-1000 ${
                            certificateRevealed
                              ? 'translate-x-[105%]'
                              : 'translate-x-0'
                          }`}
                        />
                      </div>

                      <div className='relative z-10'>
                        <div className='mb-6 space-y-3 sm:mb-8'>
                          <h2 className='px-1 text-xl font-black leading-tight tracking-[0.08em] text-amber-950 break-words drop-shadow-sm sm:text-3xl sm:tracking-[0.16em] md:text-5xl md:tracking-[0.2em]'>
                            SURAT KEPUTUSAN KELULUSAN
                          </h2>
                          <p className='mx-auto max-w-[18rem] text-center text-[0.6rem] font-semibold leading-tight tracking-[0.04em] text-amber-900/80 break-words sm:max-w-none sm:text-sm sm:tracking-[0.18em] md:text-lg md:tracking-[0.3em] md:whitespace-nowrap'>
                            NO. SK: 400.3.8/194/101.6.4.8/2026
                          </p>
                          <div className='mx-auto h-1.5 w-48 rounded-full bg-gradient-to-r from-transparent via-amber-800 to-transparent' />
                        </div>

                        <div className='mx-auto max-w-2xl space-y-5 sm:space-y-6'>
                          <p className='text-base font-medium leading-relaxed text-stone-700 sm:text-lg md:text-xl'>
                            Dengan ini dinyatakan bahwa
                          </p>

                          <div className='rounded-[1.5rem] border border-amber-200 bg-white/70 px-4 py-4 shadow-[0_10px_30px_rgba(120,73,17,0.08)] backdrop-blur-sm sm:px-6 sm:py-5'>
                            <p className='text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-amber-800/70 sm:text-sm sm:tracking-[0.35em]'>
                              Nama Siswa .{' '}
                            </p>
                            <p className='mt-2 break-words text-xl font-extrabold leading-tight text-amber-950 sm:text-2xl md:text-4xl'>
                              {foundStudent.name.toUpperCase()}
                            </p>
                          </div>

                          <div className='rounded-[1.5rem] border border-amber-200 bg-white/70 px-4 py-4 shadow-[0_10px_30px_rgba(120,73,17,0.08)] backdrop-blur-sm sm:px-6 sm:py-5'>
                            <p className='text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-amber-800/70 sm:text-sm sm:tracking-[0.35em]'>
                              Nomor Induk Siswa Nasional
                            </p>
                            <p className='mt-2 break-all text-lg font-bold tracking-[0.08em] text-amber-950 sm:text-xl md:text-2xl md:tracking-[0.2em]'>
                              {foundStudent.nisn}
                            </p>
                          </div>

                          <div className='space-y-3 pt-2'>
                            <p className='text-base font-medium leading-relaxed text-stone-700 sm:text-lg md:text-xl'>
                              Telah berhasil menyelesaikan program pembelajaran
                              di
                            </p>
                            <p className='text-lg font-semibold leading-tight text-amber-950 sm:text-xl md:text-2xl'>
                              SMA Negeri 1 Tenggarang
                            </p>
                            <p className='text-sm text-stone-700 sm:text-base md:text-lg'>
                              Tahun Ajaran 2025/2026
                            </p>
                          </div>

                          <div className='pt-2'>
                            <p className='text-base italic text-stone-600 md:text-lg'>
                              "Semoga ilmu yang telah didapat dapat bermanfaat"
                            </p>
                            <p className='mt-2 text-sm text-stone-600 md:text-base'>
                              untuk masa depan yang cerah
                            </p>
                          </div>
                        </div>

                        <div className='mt-12 grid gap-10 text-left md:grid-cols-[1fr_1fr]'>
                          <div />
                          <div className='text-center md:text-left'>
                            <p className='text-sm font-medium text-stone-700 md:text-base'>
                              Ditetapkan di Tenggarang tanggal 4 Mei 2026
                            </p>
                            <div className='h-12 md:h-16' />
                            <p className='text-sm font-semibold tracking-[0.35em] text-stone-700'>
                              Kepala Sekolah
                            </p>
                            <div className='h-4' />
                            <p className='text-base font-semibold text-amber-950 md:text-lg'>
                              Ahmad Junaidi, S.Ag, M.Pd.I
                            </p>
                            <p className='text-sm text-stone-700 md:text-base'>
                              NIP. 197211072003121006
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-4 justify-center'>
                    <button
                      onClick={handleReset}
                      className='bg-gradient-to-r from-[#f6dfb0] to-[#e8c858] text-[#06213a] py-2 px-6 rounded-lg font-semibold hover:shadow-lg transition'
                    >
                      Cari Siswa Lain
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='w-full text-center border-t-2 border-white/30 py-6 mt-12'>
            <p className='text-white font-semibold text-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]'>
              TIM KURIKULUM SMASGA JUARA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
