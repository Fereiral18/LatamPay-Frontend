import { Toaster } from "sonner";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          className:
            "border border-white/10 bg-slate-950/90 text-slate-100 backdrop-blur-xl",
        }}
      />
    </>
  );
}

export default App;
