import { Link } from "react-router-dom";

export const HomeFooter = () => (
  <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl">
    <div className="container mx-auto px-6 py-14">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
            LatamPay
          </h3>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Wallet multimoneda para gestionar, convertir y transferir dinero entre distintos
            países de Latinoamérica de forma rápida y segura.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Navegación</h4>
          <ul className="space-y-3 text-slate-400">
            <li>
              <Link to="/login" className="hover:text-cyan-400 transition text-white">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-cyan-400 transition text-white">
                Registrarse
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Soporte</h4>
          <ul className="space-y-3 text-slate-400">
            <li className="hover:text-cyan-400 transition cursor-pointer">Centro de Ayuda</li>
            <li className="hover:text-cyan-400 transition cursor-pointer">Términos y Condiciones</li>
            <li className="hover:text-cyan-400 transition cursor-pointer">Política de Privacidad</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Contacto</h4>
          <p className="text-slate-400">soporte@latampay.com</p>
          <div className="mt-5 flex gap-3">
            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-cyan-500/50 hover:text-cyan-400">X</a>
            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-cyan-500/50 hover:text-cyan-400">IG</a>
            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-cyan-500/50 hover:text-cyan-400">IN</a>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row">
        <p>© {new Date().getFullYear()} LatamPay. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
);

export default HomeFooter;
