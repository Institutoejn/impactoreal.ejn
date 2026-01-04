import React from 'react';
import { ShieldCheck, GraduationCap, Coins, ArrowRight, Heart } from 'lucide-react';
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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ejn-teal rounded-xl flex items-center justify-center">
              <Heart className="text-white w-5 h-5" fill="white" />
            </div>
            <span className="text-xl font-bold text-ejn-teal tracking-tight">Instituto <span className="font-extrabold">EJN</span></span>
          </div>
          <button 
            onClick={onStart}
            className="bg-ejn-teal text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#004d45] transition-all transform active:scale-95 shadow-lg shadow-ejn-teal/10"
          >
            Acessar Ecossistema
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-8">
        <div className="max-w-6xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-black text-ejn-teal mb-6 tracking-tight leading-[1.1]">
            O futuro não se espera, se constrói.<br />
            <span className="text-ejn-gold">O laboratório de liderança de Rio Preto.</span>
          </h1>
          <p className="text-xl md:text-2xl text-apple-text-secondary max-w-4xl mx-auto mb-12 leading-relaxed font-extralight">
            Desenvolvemos o capital humano que ditará o ritmo da inovação regional. Investimento social com foco em protagonismo e cultura de entrega.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onStart}
              className="bg-ejn-gold text-white px-10 py-5 rounded-apple-xl font-black text-lg hover:bg-[#D19900] transition-all transform active:scale-95 shadow-xl shadow-ejn-gold/20 flex items-center justify-center gap-2"
            >
              Iniciar Investimento Social
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white text-ejn-teal border border-gray-200 px-10 py-5 rounded-apple-xl font-bold text-lg hover:bg-apple-gray transition-all shadow-sm">
              Conhecer a Tese do Instituto
            </button>
          </div>
        </div>
      </section>

      {/* Value Section */}
      <section className="py-24 bg-apple-gray/50 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-ejn-teal/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-ejn-teal transition-colors">
                <ShieldCheck className="w-7 h-7 text-ejn-teal group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-ejn-teal mb-4">Ética da Execução</h3>
              <p className="text-apple-text-secondary leading-relaxed font-extralight">
                Transparência absoluta. Cada aporte é transformado em competência real através de uma trilha auditada de formação.
              </p>
            </div>

            <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-ejn-gold/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-ejn-gold transition-colors">
                <GraduationCap className="w-7 h-7 text-ejn-gold group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-ejn-teal mb-4">Protagonismo Jovem</h3>
              <p className="text-apple-text-secondary leading-relaxed font-extralight">
                Não apenas assistência. Criamos as condições para que jovens talentos assumam o comando de suas trajetórias profissionais.
              </p>
            </div>

            <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-ejn-teal/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-ejn-teal transition-colors">
                <Coins className="w-7 h-7 text-ejn-teal group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-ejn-teal mb-4">Capital Humano</h3>
              <p className="text-apple-text-secondary leading-relaxed font-extralight">
                O maior ativo de São José do Rio Preto. O investimento em liderança gera o maior ROI social e econômico da nossa região.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};