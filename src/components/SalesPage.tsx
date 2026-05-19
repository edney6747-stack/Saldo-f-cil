import { motion } from 'motion/react';
import { Check, ArrowRight, ShieldCheck, Zap, Star, X } from 'lucide-react';

interface SalesPageProps {
  onClose: () => void;
  isInitial?: boolean;
}

export function SalesPage({ onClose, isInitial = false }: SalesPageProps) {
  const checkoutUrl = "https://pay.cakto.com.br/kddy74r_842327";

  return (
    <div className="fixed inset-0 bg-white z-[200] overflow-y-auto selection:bg-secondary selection:text-white">
      {/* Navigation / Close Button */}
      <div className="fixed top-6 right-6 z-[210] flex items-center gap-4">
        {isInitial && (
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl text-ink font-bold text-sm shadow-xl hover:bg-slate-50 transition-all active:scale-95"
          >
            Ver demonstração
          </button>
        )}
        {!isInitial && (
          <button 
            onClick={onClose}
            className="p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-income rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full text-center relative z-10"
        >
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
            Oferta Limitada: 80% de Desconto
          </span>
          
          <h1 className="text-5xl md:text-8xl font-black text-ink leading-[0.9] tracking-tighter mb-8 uppercase">
            Pare de ver seu <span className="text-secondary">dinheiro sumir</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Assuma o controle total das suas finanças em <span className="text-ink font-bold">30 segundos por dia</span>. Sem planilhas complexas, sem estresse. Apenas clareza.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <motion.a 
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              animate={{ 
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 25px 50px -12px rgba(15, 23, 42, 0.3)",
                  "0 25px 50px -12px rgba(15, 23, 42, 0.5)",
                  "0 25px 50px -12px rgba(15, 23, 42, 0.3)"
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto bg-ink text-white px-10 py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all"
            >
              QUERO O CONTROLE AGORA
              <ArrowRight size={24} />
            </motion.a>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
              <ShieldCheck size={20} className="text-income" />
              Acesso Vitalício • R$ 19,00
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-ink leading-tight mb-6 uppercase tracking-tight">
                Você se sente perdido no fim do mês?
              </h2>
              <div className="space-y-4">
                {[
                  "Não sabe para onde foi cada centavo?",
                  "Sente ansiedade ao abrir o extrato do banco?",
                  "Tenta usar planilhas, mas elas são chatas demais?",
                  "Sente que trabalha muito e não sobra nada?"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-2 h-2 bg-alert rounded-full flex-shrink-0" />
                    <p className="text-lg text-slate-600 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 rotate-2">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">🍔</div>
                  <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-alert" />
                  </div>
                  <span className="font-bold text-alert">85%</span>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">
                  O Saldo Fácil resolve isso em segundos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Solution */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
              A Simplicidade que <span className="text-secondary">Enriquece</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">
              Desenvolvemos o Saldo Fácil para ser o app mais rápido do mundo. Registre seus gastos enquanto espera o café.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-secondary" />,
                title: "Registro Ultra Rápido",
                desc: "Atalhos inteligentes para o que você mais gasta. Um toque e pronto."
              },
              {
                icon: <Star className="text-income" />,
                title: "Assistente de Consciência",
                desc: "Insights automáticos que te dizem exatamente como economizar mais."
              },
              {
                icon: <ShieldCheck className="text-blue-400" />,
                title: "Privacidade Total",
                desc: "Seus dados são seus. Nada de contas, senhas ou nuvem. Tudo no seu celular."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto bg-slate-50 p-12 rounded-[48px] border-2 border-slate-100 shadow-2xl shadow-slate-200 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-secondary text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg">
            Melhor Escolha
          </div>
          
          <h2 className="text-3xl font-black text-ink mb-4 uppercase">Acesso Vitalício</h2>
          <p className="text-slate-500 font-medium mb-8">Pague uma vez, use para sempre. Sem mensalidades.</p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-slate-300 text-2xl line-through font-bold">R$ 97,00</span>
            <span className="text-6xl font-black text-ink">R$ 19,00</span>
          </div>

          <motion.a 
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            animate={{ 
              scale: [1, 1.03, 1],
              boxShadow: [
                "0 25px 50px -12px rgba(249, 115, 22, 0.3)",
                "0 25px 50px -12px rgba(249, 115, 22, 0.6)",
                "0 25px 50px -12px rgba(249, 115, 22, 0.3)"
              ]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-full bg-secondary text-white py-6 rounded-3xl font-black text-2xl flex items-center justify-center gap-3 shadow-2xl transition-all mb-6"
          >
            QUERO MEU ACESSO AGORA
          </motion.a>

          <div className="space-y-3">
            {[
              "Calculadora Integrada",
              "Categorias Personalizadas",
              "Assistente de Insights",
              "Exportação PDF/CSV",
              "Atualizações Gratuitas"
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                <Check size={16} className="text-income" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Saldo Fácil © 2026 • Organização sem estresse
        </p>
      </footer>
    </div>
  );
}
