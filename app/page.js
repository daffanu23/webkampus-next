"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; 
import Link from 'next/link';

export default function Home() {
  // --- STATE DATA ---
  const [allEvents, setAllEvents] = useState([]); 
  const [testimoni, setTestimoni] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE FILTER ---
  const [selectedNama, setSelectedNama] = useState('');
  const [selectedLokasi, setSelectedLokasi] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState('');

  // --- STATE HASIL ---
  const [displayedEvents, setDisplayedEvents] = useState([]); 

  // --- DROPDOWN DATA ---
  const [listNamaEvent, setListNamaEvent] = useState([]);
  const [listLokasi, setListLokasi] = useState([]);
  const [listTanggal, setListTanggal] = useState([]);

  // --- 1. LOAD DATA ---
  useEffect(() => {
    async function initData() {
      setLoading(true);
      
      const { data: events } = await supabase.from('tbl_m_event').select('*');
      if (events) {
        setAllEvents(events);
        setDisplayedEvents(events); 
        
        setListNamaEvent([...new Set(events.map(item => item.nama_event))]);
        setListLokasi([...new Set(events.map(item => item.alamat))]);
        setListTanggal([...new Set(events.map(item => item.tanggal_mulai))]);
      }

      const { data: newsData } = await supabase.from('tbl_m_news').select('*').limit(4);
      if (newsData) setNews(newsData);
      
      const { data: testiData } = await supabase.from('tbl_m_testimoni').select('*').limit(3);
      if (testiData) setTestimoni(testiData);

      setLoading(false);
    }
    
    initData();
  }, []);

  // --- 2. LOGIKA CARI ---
  const handleSearch = () => {
    const hasil = allEvents.filter((item) => {
      const matchNama = selectedNama ? item.nama_event === selectedNama : true;
      const matchLokasi = selectedLokasi ? item.alamat === selectedLokasi : true;
      const matchTanggal = selectedTanggal ? item.tanggal_mulai === selectedTanggal : true;
      return matchNama && matchLokasi && matchTanggal;
    });

    setDisplayedEvents(hasil);
    
    // Auto scroll ke hasil
    document.getElementById('hasil-pencarian')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-xl">L</div>
            <span className="font-bold text-xl text-blue-900 tracking-tight">LSP DIGITAL</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="/" className="text-blue-600">Home</Link>
            <Link href="#" className="hover:text-blue-600 transition">Layanan ▾</Link>
            <Link href="/testimoni" className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Isi Testimoni
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white pt-24 pb-40 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Sertifikasi Profesi <br/> <span className="text-blue-200">Standar Nasional</span>
          </h1>
          <p className="text-lg text-blue-100 mb-12 max-w-2xl mx-auto font-light">
            Tingkatkan daya saing karirmu dengan validasi kompetensi yang diakui industri.
          </p>

          {/* SEARCH BOX */}
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-end text-left border-4 border-white/20 backdrop-blur-sm">
            
            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Skema</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setSelectedNama(e.target.value)} value={selectedNama}>
                <option value="">Semua Skema</option>
                {listNamaEvent.map((n, i) => <option key={i} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Lokasi</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setSelectedLokasi(e.target.value)} value={selectedLokasi}>
                <option value="">Semua Lokasi</option>
                {listLokasi.map((l, i) => <option key={i} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Tanggal</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setSelectedTanggal(e.target.value)} value={selectedTanggal}>
                <option value="">Semua Tanggal</option>
                {listTanggal.map((t, i) => <option key={i} value={t}>{t}</option>)}
              </select>
            </div>

            <button onClick={handleSearch}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg h-[52px]">
              Cari Event
            </button>
          </div>
        </div>
      </section>

      {/* HASIL PENCARIAN */}
      <section id="hasil-pencarian" className="container mx-auto px-6 -mt-24 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
          <div className="flex justify-between items-end mb-8 pb-4 border-b border-gray-100">
            <div>
               <h2 className="text-2xl font-bold text-gray-900">Jadwal Tersedia</h2>
               <p className="text-gray-500 text-sm mt-1">Pilih jadwal yang sesuai dengan kebutuhanmu</p>
            </div>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full">
              {displayedEvents.length} Event
            </span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Sedang memuat data...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedEvents.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500">Jadwal tidak ditemukan.</p>
                </div>
              ) : (
                displayedEvents.map((event, index) => (
                  <div key={event.id || index} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300">
                    <div className="h-44 bg-gray-200 relative overflow-hidden">
                       <img src={event.foto_event || 'https://placehold.co/400x300'} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                       <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-blue-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                         {event.code_event}
                       </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition">{event.nama_event}</h3>
                      <div className="space-y-2 mb-6">
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                           <span className="text-blue-400">📍</span> {event.alamat} ({event.tuk})
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                           <span className="text-red-400">📅</span> {new Date(event.tanggal_mulai).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <button className="w-full bg-blue-50 text-blue-600 text-sm font-bold py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition">
                        Detail Event
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* BERITA & TESTIMONI (Pelengkap Tampilan) */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-10 text-center text-gray-900">Berita & Informasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {news.map((item, index) => (
                    <div key={item.id_news || index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
                        <div className="h-32 rounded-lg bg-gray-200 mb-4 overflow-hidden">
                           <img src={item.tbl_pict} className="w-full h-full object-cover"/>
                        </div>
                        <span className="text-xs text-blue-500 font-semibold">{new Date(item.tgl_upload).toLocaleDateString()}</span>
                        <h4 className="font-bold text-sm mt-1 mb-2 line-clamp-2 text-gray-800">{item.tbl_title}</h4>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-10 text-center text-sm border-t-4 border-blue-600">
        <p className="font-semibold text-white mb-2">LSP Teknologi Digital</p>
        <p>&copy; 2026. All rights reserved.</p>
      </footer>
    </main>
  );
}