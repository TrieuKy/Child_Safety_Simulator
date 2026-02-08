import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stage, useGLTF, Html, Float } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { utils, write } from 'xlsx';
import saveAs from 'file-saver';

// --- TYPE INTERFACE ---
interface User {
  name: string;
  email: string;
}

// --- COMPONENT 1: DASHBOARD BÁO CÁO ---
const ReportDashboard = ({ isGuest }: { isGuest: boolean }) => {
  const navigate = useNavigate();

  const exportToExcel = () => {
    if (isGuest) return;

    const data = [
      { Category: "Risk Assessment", Metric: "Overall Danger", Value: "85%", Status: "DANGER" },
      { Category: "Risk Assessment", Metric: "Head Injury Probability", Value: "92%", Status: "Critical" },
      { Category: "Risk Assessment", Metric: "Limb Fracture Risk", Value: "45%", Status: "Warning" },
      { Category: "Recommendation", Metric: "Unstable Base", Value: "Center of gravity too high", Status: "Critical" },
      { Category: "Recommendation", Metric: "Sharp Edges", Value: "Corners at 90cm are sharp", Status: "Warning" },
    ];

    // @ts-ignore
    const ws = utils.json_to_sheet(data);
    // @ts-ignore
    const wb = utils.book_new();
    // @ts-ignore
    utils.book_append_sheet(wb, ws, "Risk Report");
    // @ts-ignore
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "RiskReport.xlsx");
  };

  if (isGuest) {
    return (
      <div className="mt-8 relative overflow-hidden rounded-[2rem] border-4 border-dashed border-gray-200">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg border border-pink-100">
            <span className="text-6xl mb-4 block">🔒</span>
            <h3 className="text-2xl font-black text-slate-700 mb-2">Detailed Report Locked</h3>
            <p className="text-slate-500 mb-6 font-medium">
              Create a free account to view detailed safety analysis, heatmaps, and download Excel reports!
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => navigate('/login')} className="px-6 py-3 rounded-xl bg-pink-500 text-white font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all">Login</button>
              <button onClick={() => navigate('/register')} className="px-6 py-3 rounded-xl bg-white border-2 border-pink-200 text-pink-500 font-bold hover:bg-pink-50 transition-all">Register</button>
            </div>
          </div>
        </div>
        {/* Fake Content Background */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 opacity-20 pointer-events-none filter blur-sm">
          <div className="h-64 bg-gray-300 rounded-3xl"></div>
          <div className="h-64 bg-gray-300 rounded-3xl"></div>
          <div className="h-64 bg-gray-300 rounded-3xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up font-medium">

      {/* CỘT 1: TỔNG QUAN TỈ LỆ TAI NẠN */}
      <div className="glass-panel p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 rounded-bl-full -mr-6 -mt-6 opacity-40 blur-xl"></div>
        <h3 className="text-pink-600 font-extrabold text-2xl mb-6 flex items-center gap-2">
          📊 Safety Check
        </h3>

        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffe4e6" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fb7185" strokeWidth="3" strokeDasharray="85, 100" strokeLinecap="round" />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-5xl font-black text-rose-500">85%</span>
              <p className="text-sm font-bold text-rose-300 uppercase mt-1">Danger!</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2 font-bold text-gray-600">
              <span>🤕 Head Bump Risk</span>
              <span className="text-rose-500">92%</span>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-4">
              <div className="bg-gradient-to-r from-rose-400 to-pink-500 h-4 rounded-full shadow-md" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2 font-bold text-gray-600">
              <span>🦴 Ouchie Risk</span>
              <span className="text-amber-500">45%</span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-4">
              <div className="bg-gradient-to-r from-amber-300 to-yellow-400 h-4 rounded-full shadow-md" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT 2: HEATMAP */}
      <div className="glass-panel p-8 flex flex-col relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-200 rounded-tr-full -ml-6 -mb-6 opacity-40 blur-xl"></div>
        <h3 className="text-orange-500 font-extrabold text-2xl mb-2 flex items-center gap-2">
          🔥 Danger Zones
        </h3>
        <p className="text-sm font-bold text-gray-500 mb-6 bg-white/50 p-2 rounded-xl inline-block w-fit">
          Height: 80cm - 110cm (Toddler Zone)
        </p>

        <div className="flex-1 w-full bg-white/60 rounded-3xl border-2 border-dashed border-pink-200 relative overflow-hidden flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(#fb7185 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-rose-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-amber-400 rounded-full blur-2xl opacity-50"></div>

          <div className="border-4 border-white w-32 h-48 relative z-10 flex items-center justify-center rounded-2xl bg-white/30 backdrop-blur-md shadow-sm">
            <span className="text-rose-400 text-sm font-black uppercase tracking-wider">Front View</span>
          </div>
        </div>
      </div>

      {/* CỘT 3: KẾT LUẬN & ĐỀ XUẤT */}
      <div className="glass-panel p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-br-full -ml-6 -mt-6 opacity-40 blur-xl"></div>
        <h3 className="text-emerald-600 font-extrabold text-2xl mb-6 flex items-center gap-2">
          🤖 AI Advice
        </h3>
        <div className="space-y-4 text-sm">
          <div className="bg-rose-50 border-l-4 border-rose-400 p-4 rounded-r-xl shadow-sm">
            <h4 className="font-bold text-rose-500 text-lg flex items-center gap-2">
              <span className="text-2xl">❗</span> Tipping Hazard
            </h4>
            <p className="text-gray-600 mt-1">It might wobble! Please secure it to the wall.</p>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-sm">
            <h4 className="font-bold text-amber-600 text-lg flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Sharp Corners
            </h4>
            <p className="text-gray-600 mt-1">Ouch! Those edges look sharp. Use soft guards.</p>
          </div>

          <div className="pt-8">
            <button
              onClick={exportToExcel}
              className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-200/50 transform active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📥</span> Download Report
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

// --- COMPONENT HIỂN THỊ MODEL ---
const UploadedModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

// --- FUN 3D ICON FOR HERO SECTION ---
const FloatingHeroIcon = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Simple 3D shapes representing toys/safety */}
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <meshStandardMaterial color="#f472b6" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[2, -1, -2]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.3} />
        </mesh>
        <mesh position={[-2, 1, -1]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.3} />
        </mesh>
      </Float>
    </Canvas>
  )
}


// --- MAIN COMPONENT ---
const Simulator = () => {
  const navigate = useNavigate();
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("No file chosen");
  const [isSimulating, setIsSimulating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const isGuest = !user;

  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      setFileName(file.name);
      setShowReport(false);
    }
  };

  const runSimulation = () => {
    if (!modelUrl) return alert("Please upload a GLB file first!");

    setIsSimulating(true);
    setShowReport(false);

    setTimeout(() => {
      setIsSimulating(false);
      setShowReport(true);
      setTimeout(() => {
        document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2000);
  };

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-pink-50/50 text-gray-700 font-sans selection:bg-pink-200 selection:text-pink-900">

      {/* --- HEADER --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-white/0 transition-all duration-300 lg:px-12 backdrop-blur-[2px]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">🛡️</div>
          <span className="font-extrabold text-xl tracking-tight text-slate-700">ChildSafety</span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="font-bold text-gray-600 hidden md:inline">Hi, {user.name}! 👋</span>
              <button onClick={handleLogout} className="bg-white/80 hover:bg-rose-50 text-rose-500 font-bold px-5 py-2 rounded-xl transition shadow-sm border border-rose-100 flex items-center gap-2 text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="px-5 py-2 text-pink-600 font-bold hover:bg-pink-50 rounded-xl transition">Login</button>
              <button onClick={() => navigate('/register')} className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 transition">Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* --- BACKGROUND BLOBS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* --- LANDING SECTION --- */}
      <section className="h-screen flex flex-col lg:flex-row items-center justify-center relative z-10 px-6 gap-10 max-w-7xl mx-auto pt-20">

        {/* TEXT CONTENT */}
        <div className="glass-panel p-10 lg:p-14 text-center lg:text-left shadow-2xl animate-fade-in-up flex-1 max-w-2xl backdrop-blur-xl bg-white/60">
          <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 mb-6 drop-shadow-sm tracking-tight leading-[1.1]">
            <span className="block text-4xl lg:text-5xl text-gray-600 font-extrabold mb-2">Build a safer world</span>
            Child Safety Simulator
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 font-bold mb-10 leading-relaxed">
            Instantly analyze your furniture designs for child safety hazards using advanced AI and physics simulation.
            Designed for <span className="text-pink-500">Parents</span> & <span className="text-purple-500">Designers</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={scrollToWorkspace}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-pink-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600 hover:bg-pink-600 hover:scale-[1.03] shadow-xl shadow-pink-300/50"
            >
              <span>Try Simulator</span>
              <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform">🚀</span>
            </button>
            {!user && (
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-pink-600 bg-white border-2 border-pink-100 rounded-2xl hover:bg-pink-50 hover:border-pink-200 transition-all shadow-sm"
              >
                Create Account
              </button>
            )}
          </div>
        </div>

        {/* 3D FLOATING HERO ELEMENT */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] flex items-center justify-center relative hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-[3rem] blur-3xl"></div>
          <div className="w-full h-full relative z-10">
            <FloatingHeroIcon />
          </div>
        </div>
      </section>

      {/* --- WORKSPACE SECTION --- */}
      <section ref={workspaceRef} className="min-h-screen py-20 px-4 md:px-8 relative z-10 bg-white/40 backdrop-blur-md rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-white/60">

        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-md text-3xl">🧸</div>
              <div>
                <h2 className="text-3xl font-black text-slate-700">Simulator Workspace</h2>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${isGuest ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                    {isGuest ? 'Guest Mode' : 'Pro Mode'}
                  </span>
                  <p className="text-slate-500 font-medium">Upload model & check for safety</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTROL BAR */}
          <div className="glass-panel p-6 mb-8 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-gradient-to-br from-pink-400 to-rose-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-pink-200">1</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Upload 3D Model</h3>
                <p className="text-xs text-gray-500">Supported formats: .glb, .gltf</p>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
              <label className="cursor-pointer group flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm border-2 border-dashed border-pink-300 hover:border-pink-500 transition-all w-full md:w-auto justify-center">
                <input type="file" accept=".glb, .gltf" className="hidden" onChange={handleFileUpload} />
                <span className="text-2xl group-hover:scale-110 transition-transform">📂</span>
                <span className="font-bold text-gray-600 group-hover:text-pink-600 transition-colors">
                  {fileName === "No file chosen" ? "Choose File..." : "Change File"}
                </span>
              </label>
              {fileName !== "No file chosen" && (
                <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-lg text-sm font-bold truncate max-w-[200px]">
                  {fileName}
                </span>
              )}
            </div>

            <button
              onClick={runSimulation}
              disabled={isSimulating || !modelUrl}
              className={`px-8 py-4 rounded-xl text-base font-black transition-all flex items-center gap-3 shadow-lg transform active:scale-95
                 ${isSimulating
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white shadow-orange-200'}`}
            >
              {isSimulating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>🚀 Run Analysis</>
              )}
            </button>
          </div>

          {/* MAIN 3D VIEW (CANVAS) */}
          <div className="h-[600px] w-full bg-gradient-to-b from-sky-50 to-white rounded-[3rem] shadow-[inset_0_4px_20px_rgba(0,0,0,0.05)] border-4 border-white relative overflow-hidden group">
            <Canvas shadows dpr={[1, 2]} camera={{ position: [5, 5, 5], fov: 50 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

              <Suspense fallback={<Html center><div className="text-pink-400 font-bold text-2xl animate-pulse">Loading Toy... 🧸</div></Html>}>
                {modelUrl ? (
                  <Stage environment="city" intensity={0.6} adjustCamera>
                    <UploadedModel url={modelUrl} />
                  </Stage>
                ) : null}
              </Suspense>

              <Grid
                renderOrder={-1}
                position={[0, -0.01, 0]}
                infiniteGrid
                cellSize={1}
                sectionSize={5}
                sectionColor="#fbcfe8" // Pink 200
                cellColor="#f0f9ff"    // Sky 50
                fadeDistance={30}
              />
              <OrbitControls makeDefault />
            </Canvas>

            {/* Empty State Overlay */}
            {!modelUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl text-center shadow-xl transform rotate-[-2deg] border border-white">
                  <span className="text-6xl mb-4 block">👈</span>
                  <p className="text-slate-600 font-black text-2xl">Upload a 3D Model</p>
                  <p className="text-slate-400 font-medium mt-2">to start the safety check!</p>
                </div>
              </div>
            )}

            {/* Loading Overlay */}
            {isSimulating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <div className="w-24 h-24 border-8 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-6"></div>
                <p className="text-pink-500 font-black text-3xl animate-pulse tracking-wide">AI Checking Risks...</p>
              </div>
            )}
          </div>

          {/* REPORT SECTION */}
          {showReport && (
            <div id="report-section" className="scroll-mt-8">
              <ReportDashboard isGuest={isGuest} />
            </div>
          )}

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-pink-100 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">

          {/* SCHOOL INFO */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 shadow-sm border border-pink-100">
              {/* Placeholder for HUTECH Logo */}
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Logo_HUTECH.png/1200px-Logo_HUTECH.png" alt="HUTECH Logo" className="w-full h-full object-contain opacity-80" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=HUTECH'; }} />
            </div>
            <div className="text-left">
              <h4 className="font-black text-slate-700 text-lg">HUTECH University</h4>
              <p className="text-sm font-bold text-pink-500">Trường Đại học Công Nghệ TP.HCM</p>
            </div>
          </div>

          {/* CONTEST INFO */}
          <div className="text-center md:text-right">
            <p className="font-black text-slate-600 text-lg mb-1">Website & AI Innovation Contest</p>
            <div className="text-sm font-medium text-slate-500 space-y-1">
              <p>Thành viên: <span className="font-bold text-pink-500">Đỗ Thư Kỳ</span> (BackEnd) & <span className="font-bold text-purple-500">Triệu Đoan Kỳ</span> (FontEnd)</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-xs font-bold text-gray-400">
          © 2026 Child Safety Simulator. Built with ❤️ for Kids.
        </div>
      </footer>
    </div>
  );
};

export default Simulator;