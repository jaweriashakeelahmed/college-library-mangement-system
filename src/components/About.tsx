import { Code2, Github, Terminal, Coffee } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-3xl mx-auto w-full space-y-10">
      <div className="text-center space-y-5">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-blue-100/50">
          <span className="text-5xl">🏛</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">College Library Management System</h2>
          <p className="text-lg text-slate-500 mt-2 font-medium">University First Year Project</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 md:p-10 space-y-10">
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">About the Project</h3>
          <p className="text-slate-600 leading-relaxed text-[15px]">
            Dedicated as an C++ project for software expo from CS department.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Technology Stack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <Terminal className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Backend Logic</p>
                <p className="text-sm text-slate-500 font-medium mt-0.5">C++ (File Handling)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-sm">
                <Code2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Web Frontend</p>
                <p className="text-sm text-slate-500 font-medium mt-0.5">HTML5, CSS3, React</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-sm">
                <Coffee className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Desktop GUI</p>
                <p className="text-sm text-slate-500 font-medium mt-0.5">Java (Swing API)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <Github className="w-6 h-6 text-slate-800" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Open Source</p>
                <p className="text-sm text-slate-500 font-medium mt-0.5">Ready for GitHub deployment</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 opacity-80">Developer</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-blue-950 tracking-tight">Jaweria Shakeel</p>
              <p className="text-blue-800/80 font-medium mt-0.5">Computer Science Student</p>
            </div>
            <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm border border-blue-100">
              JS
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
