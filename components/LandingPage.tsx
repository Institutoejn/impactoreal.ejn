import React from 'react';
import { ShieldCheck, GraduationCap, Coins, ArrowRight } from 'lucide-react';
import { Footer } from './Footer';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <span className="text-xl md:text-2xl font-bold tracking-tighter font-poppins">
              <span className="text-ejn-gold">Impacto Real</span> <span className="text-ejn-teal">IEJN</span>
            </span>
          </button>
          <button 
            onClick={onStart}
            className="bg-ejn-teal text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#004d45] transition-all transform active:scale-95"
          >
            Acessar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-8">
        <div className="max-w-5xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-ejn-teal mb-8 tracking-tighter leading-none">
            Desperte o <span className="text-ejn-gold">amanhã.</span>
          </h1>
          <p className="text-xl md:text-3xl text-apple-text-secondary max-w-3xl mx-auto mb-16 leading-tight font-extralight">
            Educação, postura e liderança. O futuro da nossa juventude em suas mãos.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={onStart}
              className="bg-ejn-teal text-white px-12 py-5 rounded-apple-xl font-bold text-xl hover:bg-[#004d45] transition-all transform active:scale-95 shadow-2xl shadow-ejn-teal/20 flex items-center justify-center gap-3"
            >
              Mudar uma vida
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="bg-white text-ejn-teal border-2 border-ejn-teal/10 px-12 py-5 rounded-apple-xl font-bold text-xl hover:bg-apple-gray transition-all">
              Saiba mais
            </button>
          </div>
        </div>
      </section>

      {/* Value Section */}
      <section className="py-32 bg-apple-gray/30 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-ejn-teal transition-all duration-500">
                <ShieldCheck className="w-8 h-8 text-ejn-teal group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-ejn-teal mb-4">Destino real.</h3>
              <p className="text-apple-text-secondary leading-snug font-extralight text-lg">
                Onde cada centavo encontra um sonho. Rastreamento absoluto.
              </p>
            </div>

            <div className="group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-ejn-gold transition-all duration-500">
                <GraduationCap className="w-8 h-8 text-ejn-gold group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-ejn-teal mb-4">Líderes.</h3>
              <p className="text-apple-text-secondary leading-snug font-extralight text-lg">
                Despertamos o protagonismo. Formamos quem faz acontecer.
              </p>
            </div>

            <div className="group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-ejn-teal transition-all duration-500">
                <Coins className="w-8 h-8 text-ejn-teal group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-ejn-teal mb-4">Impacto.</h3>
              <p className="text-apple-text-secondary leading-snug font-extralight text-lg">
                Capital social investido em Rio Preto. Retorno humano real.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};