import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Radar, Search, MapPin, Loader2, Globe, GlobeLock, Phone, Download,
  CheckSquare, Square, Target, Building2, Sparkles, Star, Map as MapIcon
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useToast } from '../components/Toast';

const CURITIBA = { lat: -25.4284, lng: -49.2733 };

function ControleMapa({ center, onClickMapa }) {
  const map = useMap();
  useEffect(() => { map.setView([center.lat, center.lng]); }, [center.lat, center.lng]);
  useMapEvents({ click(e) { onClickMapa({ lat: e.latlng.lat, lng: e.latlng.lng }); } });
  return null;
}

export default function Prospeccao() {
  const { showToast, ToastHost } = useToast();
  const [center, setCenter] = useState(CURITIBA);
  const [raio, setRaio] = useState(1500);
  const [categorias, setCategorias] = useState([]);
  const [selCategorias, setSelCategorias] = useState(['restaurante', 'dentista', 'academia']);
  const [busca, setBusca] = useState('');
  const [lugares, setLugares] = useState([]);
  const [buscandoLocal, setBuscandoLocal] = useState(false);

  const [resultado, setResultado] = useState(null);
  const [varrendo, setVarrendo] = useState(false);
  const [selecionados, setSelecionados] = useState([]);

  const [vendedores, setVendedores] = useState([]);
  const [vendedorId, setVendedorId] = useState('');
  const [importando, setImportando] = useState(false);

  const [googleDisponivel, setGoogleDisponivel] = useState(false);
  const [fonteGoogle, setFonteGoogle] = useState(false);

  useEffect(() => {
    api.get('/prospeccao/categorias').then(r => r.data.success && setCategorias(r.data.data)).catch(() => {});
    api.get('/auth/vendedores').then(r => r.data.success && setVendedores(r.data.data)).catch(() => {});
    api.get('/prospeccao/config').then(r => {
      if (r.data.success) {
        setGoogleDisponivel(r.data.data.google_disponivel);
        setFonteGoogle(r.data.data.google_disponivel); // usa Google por padrão se disponível
      }
    }).catch(() => {});
  }, []);

  const toggleCategoria = (id) => {
    setSelCategorias(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const geocodificar = async () => {
    if (busca.trim().length < 2) return;
    setBuscandoLocal(true);
    setLugares([]);
    try {
      const r = await api.get('/prospeccao/geocode', { params: { q: busca } });
      if (r.data.success) setLugares(r.data.data);
      if (r.data.success && r.data.data.length === 0) showToast('Local não encontrado.', 'info');
    } catch {
      showToast('Erro ao localizar endereço.', 'error');
    } finally {
      setBuscandoLocal(false);
    }
  };

  const escolherLugar = (lugar) => {
    setCenter({ lat: lugar.latitude, lng: lugar.longitude });
    setLugares([]);
    setBusca(lugar.nome.split(',').slice(0, 2).join(', '));
  };

  const varrer = async () => {
    if (selCategorias.length === 0) return showToast('Selecione ao menos um tipo de empresa.', 'info');
    setVarrendo(true);
    setResultado(null);
    setSelecionados([]);
    try {
      const r = await api.post('/prospeccao/buscar', {
        latitude: center.lat, longitude: center.lng, raio, categorias: selCategorias,
        fonte: fonteGoogle ? 'google' : 'osm',
      });
      if (r.data.success) {
        setResultado(r.data.data);
        showToast(`${r.data.data.total} empresas · ${r.data.data.sem_site} sem site`, 'success');
      }
    } catch (e) {
      showToast(e.response?.data?.error || 'Falha na varredura.', 'error');
    } finally {
      setVarrendo(false);
    }
  };

  const toggleSel = (ref) => {
    setSelecionados(prev => prev.includes(ref) ? prev.filter(r => r !== ref) : [...prev, ref]);
  };

  // Seleciona o grupo (com/sem site); se já estiver todo selecionado, desmarca.
  const alternarGrupo = (filtro) => {
    if (!resultado) return;
    const refs = resultado.empresas.filter(filtro).map(e => e.osm_ref);
    if (refs.length === 0) return;
    setSelecionados(prev => {
      const todosSelecionados = refs.every(r => prev.includes(r));
      return todosSelecionados
        ? prev.filter(r => !refs.includes(r))
        : Array.from(new Set([...prev, ...refs]));
    });
  };
  const selecionarSemSite = () => alternarGrupo(e => !e.possui_website);
  const selecionarComSite = () => alternarGrupo(e => e.possui_website);

  const importar = async () => {
    if (selecionados.length === 0) return showToast('Selecione empresas para importar.', 'info');
    const empresas = resultado.empresas.filter(e => selecionados.includes(e.osm_ref));
    setImportando(true);
    try {
      const r = await api.post('/prospeccao/importar', { empresas, vendedor_id: vendedorId || null });
      if (r.data.success) {
        showToast(`${r.data.inseridos} leads importados${r.data.duplicados ? ` · ${r.data.duplicados} já existiam` : ''}!`, 'success');
        setSelecionados([]);
      }
    } catch {
      showToast('Erro ao importar leads.', 'error');
    } finally {
      setImportando(false);
    }
  };

  const kmLabel = raio >= 1000 ? `${(raio / 1000).toFixed(1)} km` : `${raio} m`;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center gap-3 px-6 shrink-0 z-10">
          <Radar className="text-indigo-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Prospecção no Mapa</h1>
            <p className="text-xs text-slate-500">Encontre empresas sem site e transforme em oportunidades</p>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* PAINEL DE CONTROLE */}
          <div className="w-80 shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-5">
              {/* Local */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5 mb-2"><MapPin size={13} /> Local da varredura</label>
                <div className="flex gap-2">
                  <input
                    value={busca} onChange={e => setBusca(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && geocodificar()}
                    placeholder="Cidade, bairro ou endereço"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button onClick={geocodificar} disabled={buscandoLocal} className="bg-slate-900 hover:bg-obsidian text-white px-3 rounded-lg flex items-center justify-center">
                    {buscandoLocal ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                  </button>
                </div>
                {lugares.length > 0 && (
                  <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                    {lugares.map((l, i) => (
                      <button key={i} onClick={() => escolherLugar(l)} className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-indigo-50 transition-colors">
                        {l.nome}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1"><Target size={11} /> Ou clique no mapa para definir o ponto central.</p>
              </div>

              {/* Raio */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 flex items-center justify-between mb-2">
                  <span>Raio</span><span className="text-indigo-600 font-extrabold">{kmLabel}</span>
                </label>
                <input type="range" min="300" max="5000" step="100" value={raio} onChange={e => setRaio(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>

              {/* Categorias */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5 mb-2"><Building2 size={13} /> Tipos de empresa</label>
                <div className="flex flex-wrap gap-1.5">
                  {categorias.map(cat => {
                    const on = selCategorias.includes(cat.id);
                    return (
                      <button key={cat.id} onClick={() => toggleCategoria(cat.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${on ? 'bg-brand-gradient text-white border-transparent shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fonte de dados */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1.5 mb-2"><MapIcon size={13} /> Fonte dos dados</label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button onClick={() => setFonteGoogle(false)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${!fonteGoogle ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    OpenStreetMap
                  </button>
                  <button onClick={() => googleDisponivel && setFonteGoogle(true)} disabled={!googleDisponivel}
                    title={googleDisponivel ? '' : 'Configure GOOGLE_MAPS_API_KEY no backend'}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${fonteGoogle ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'} ${!googleDisponivel ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    Google Maps
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  {fonteGoogle
                    ? 'Google Maps: avaliações, horários, preços e mais (consome cota da API).'
                    : googleDisponivel ? 'OpenStreetMap: gratuito, dados básicos.' : 'Google Maps indisponível — chave não configurada no backend.'}
                </p>
              </div>

              <button onClick={varrer} disabled={varrendo} className="w-full bg-brand-gradient text-white font-bold py-3 rounded-xl shadow-voltage flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-60 transition">
                {varrendo ? <><Loader2 className="animate-spin" size={18} /> Varrendo região…</> : <><Radar size={18} /> Varrer região</>}
              </button>

              {/* Estatísticas */}
              {resultado && (
                <div className="grid grid-cols-3 gap-2 dp-fade-up">
                  <div className="bg-slate-50 rounded-lg p-2.5 text-center border border-slate-100">
                    <p className="text-lg font-extrabold text-slate-800">{resultado.total}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Total</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2.5 text-center border border-emerald-100">
                    <p className="text-lg font-extrabold text-emerald-600">{resultado.sem_site}</p>
                    <p className="text-[10px] text-emerald-700 uppercase">Sem site</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 text-center border border-slate-100">
                    <p className="text-lg font-extrabold text-slate-400">{resultado.com_site}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Com site</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MAPA */}
          <div className="flex-1 relative min-w-0">
            <MapContainer center={[center.lat, center.lng]} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ControleMapa center={center} onClickMapa={setCenter} />
              <Circle center={[center.lat, center.lng]} radius={raio} pathOptions={{ color: '#4F46E5', fillColor: '#6366F1', fillOpacity: 0.08, weight: 1.5 }} />
              <CircleMarker center={[center.lat, center.lng]} radius={6} pathOptions={{ color: '#fff', weight: 2, fillColor: '#7C3AED', fillOpacity: 1 }} />
              {resultado?.empresas.map(e => (
                <CircleMarker key={e.osm_ref} center={[e.latitude, e.longitude]} radius={7}
                  pathOptions={{
                    color: '#fff', weight: 1.5,
                    fillColor: e.possui_website ? '#94A3B8' : '#10B981',
                    fillOpacity: selecionados.includes(e.osm_ref) ? 1 : 0.85,
                  }}
                  eventHandlers={{ click: () => toggleSel(e.osm_ref) }}>
                  <Popup>
                    <div className="text-xs">
                      <p className="font-bold text-slate-800">{e.empresa}</p>
                      <p className="text-slate-500">{e.categoria}</p>
                      {e.rating ? <p className="text-amber-600 font-semibold">★ {e.rating} {e.total_avaliacoes ? `(${e.total_avaliacoes})` : ''}</p> : null}
                      {e.telefone && <p className="text-slate-500">{e.telefone}</p>}
                      <p className={`mt-1 font-semibold ${e.possui_website ? 'text-slate-400' : 'text-emerald-600'}`}>
                        {e.possui_website ? 'Já tem site' : '★ Oportunidade — sem site'}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>

            <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-md text-[11px] text-slate-600 flex items-center gap-3 border border-slate-200">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Sem site</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-400 inline-block" /> Com site</span>
            </div>
          </div>

          {/* RESULTADOS */}
          {resultado && (
            <div className="w-96 shrink-0 border-l border-slate-200 bg-white flex flex-col min-h-0 dp-fade-up">
              <div className="p-3 border-b border-slate-200 shrink-0 space-y-2">
                <p className="text-sm font-bold text-slate-700">{resultado.empresas.length} encontradas</p>
                <div className="flex gap-2">
                  <button onClick={selecionarSemSite} className="flex-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-2 py-1.5 flex items-center justify-center gap-1 transition-colors">
                    <Sparkles size={13} /> Sem site
                  </button>
                  <button onClick={selecionarComSite} className="flex-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-2 py-1.5 flex items-center justify-center gap-1 transition-colors">
                    <Globe size={13} /> Com site
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center">Clique de novo no botão para desmarcar o grupo.</p>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                {resultado.empresas.map(e => {
                  const sel = selecionados.includes(e.osm_ref);
                  return (
                    <button key={e.osm_ref} onClick={() => toggleSel(e.osm_ref)}
                      className={`w-full text-left px-3 py-3 flex gap-3 hover:bg-slate-50 transition-colors ${sel ? 'bg-indigo-50/60' : ''}`}>
                      <div className="pt-0.5">{sel ? <CheckSquare className="text-indigo-600" size={18} /> : <Square className="text-slate-300" size={18} />}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800 text-sm truncate">{e.empresa}</p>
                          {e.possui_website
                            ? <Globe size={13} className="text-slate-400 shrink-0" />
                            : <span className="shrink-0 text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase tracking-wide">Sem site</span>}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{e.categoria}{e.endereco ? ` · ${e.endereco}` : ''}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {e.rating ? <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-0.5"><Star size={10} className="fill-amber-500 text-amber-500" /> {e.rating}{e.total_avaliacoes ? ` (${e.total_avaliacoes})` : ''}</span> : null}
                          {e.telefone && <span className="text-[11px] text-slate-400 flex items-center gap-1"><Phone size={10} /> {e.telefone}</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 border-t border-slate-200 space-y-2 shrink-0 bg-slate-50">
                <select value={vendedorId} onChange={e => setVendedorId(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Atribuir a um vendedor (opcional)</option>
                  {vendedores.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
                </select>
                <button onClick={importar} disabled={importando || selecionados.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition">
                  {importando ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                  Importar {selecionados.length > 0 ? `(${selecionados.length})` : ''} para o funil
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <ToastHost />
    </div>
  );
}
