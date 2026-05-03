'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export type Student = {
  nis: string;
  name: string;
};

export default function GraduationPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [nis, setNis] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetch('/data/students.json');
        const data = await response.json();
        setStudents(data.students);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data siswa');
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  useEffect(() => {
    if (foundStudent && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Handle audio play error silently
      });
    }
  }, [foundStudent]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFoundStudent(null);

    if (!nis.trim()) {
      setError('Masukkan NIS Anda');
      return;
    }

    const student = students.find(
      (s) => s.nis.toLowerCase() === nis.toLowerCase().trim()
    );

    if (student) {
      setFoundStudent(student);
    } else {
      setError('NIS tidak ditemukan');
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

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='text-gray-600'>Memuat data...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 flex flex-col'>
      {/* Audio Element */}
      <audio ref={audioRef} loop>
        <source src='/audio/mars.mp3' type='audio/mpeg' />
      </audio>

      {/* Header - Always at Top */}
      <div className='max-w-4xl mx-auto w-full mb-8'>
        <div className='flex justify-between items-center bg-white rounded-lg shadow-lg p-6'>
          {/* Logo - Left */}
          <div className='flex-shrink-0'>
            <Image
              src='/images/logo-smasga.png'
              alt='Logo SMASGA'
              width={128}
              height={128}
              className='h-32 w-32'
            />
          </div>

          {/* Title - Right */}
          <div className='text-center flex-1'>
            <h1 className='text-5xl font-bold text-purple-900 mb-2'>
              SMASGA JUARA
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {!foundStudent ? (
          // Search Form - Centered View
          <div className='flex-1 flex flex-col items-center justify-center'>
            <div className='max-w-4xl w-full'>
              {/* Main Header */}
              <div className='text-center mb-8'>
                <h2 className='text-4xl font-bold text-gray-800 mb-2'>
                  Pengumuman Kelulusan
                </h2>
                <p className='text-xl text-gray-600 mb-1'>
                  SMA Negeri 1 Tenggarang
                </p>
                <p className='text-lg text-blue-700 font-semibold mb-4'>
                  Berkarakter, Berprestasi, dan Kompetitif
                </p>
                <p className='text-gray-500'>
                  Masukkan NIS Anda untuk melihat sertifikat
                </p>
              </div>

              {/* Search Form */}
              <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
                <form onSubmit={handleSearch} className='space-y-4'>
                  <div>
                    <label
                      htmlFor='nis'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Nomor Induk Siswa (NIS)
                    </label>
                    <input
                      type='text'
                      id='nis'
                      value={nis}
                      onChange={(e) => setNis(e.target.value)}
                      placeholder='Masukkan NIS Anda...'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                      autoFocus
                    />
                  </div>
                  {error && <p className='text-red-500 text-sm'>{error}</p>}
                  <button
                    type='submit'
                    className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition'
                  >
                    Cari Sertifikat
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          // Certificate View - Normal Layout
          <div className='max-w-4xl mx-auto w-full'>
            {/* Certificate */}
            <div className='space-y-6'>
              <div className='bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-2xl p-12 text-center border-8 border-purple-900'>
                {/* Certificate Header */}
                <div className='mb-8'>
                  <h2 className='text-4xl font-bold text-purple-900 mb-2'>
                    SERTIFIKAT KELULUSAN
                  </h2>
                  <div className='h-1 bg-gradient-to-r from-purple-900 to-purple-700 max-w-xs mx-auto'></div>
                </div>

                {/* Certificate Content */}
                <div className='space-y-6 mb-8'>
                  <p className='text-gray-700'>
                    Dengan ini kami sertifikasi bahwa
                  </p>

                  <div className='bg-white bg-opacity-60 rounded-lg py-4 px-6'>
                    <p className='text-sm text-gray-600 mb-2'>Nama Siswa</p>
                    <p className='text-3xl font-bold text-amber-900'>
                      {foundStudent.name.toUpperCase()}
                    </p>
                  </div>

                  <div className='bg-white bg-opacity-60 rounded-lg py-4 px-6'>
                    <p className='text-sm text-gray-600 mb-2'>
                      Nomor Induk Siswa
                    </p>
                    <p className='text-2xl font-semibold text-amber-900'>
                      {foundStudent.nis}
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <p className='text-gray-700'>
                      Telah berhasil menyelesaikan program pembelajaran pada
                    </p>
                    <p className='text-lg font-semibold text-amber-900'>
                      SMA Negeri 1 Tenggarang
                    </p>
                    <p className='text-gray-700'>Tahun Ajaran 2025/2026</p>
                  </div>

                  <div className='pt-4'>
                    <p className='text-gray-700 italic'>
                      "Semoga ilmu yang telah didapat dapat bermanfaat"
                    </p>
                    <p className='text-gray-700 mt-2'>
                      untuk masa depan yang cerah
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className='text-sm text-gray-600 pt-4'>
                  <p>Dikeluarkan di Tenggarang</p>
                  <p>Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4 justify-center'>
                <button
                  onClick={handleReset}
                  className='bg-gray-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700 transition'
                >
                  Cari Siswa Lain
                </button>
                <button
                  onClick={() => window.print()}
                  className='bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition'
                >
                  Cetak/Unduh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='w-full text-center border-t-2 border-gray-300 py-6 mt-12'>
        <p className='text-gray-700 font-semibold text-lg'>
          TIM KURIKULUM SMASGA JUARA
        </p>
      </div>
    </div>
  );
}
