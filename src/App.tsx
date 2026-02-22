/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pizza, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Instagram, 
  Facebook, 
  ChevronRight,
  Flame,
  Leaf,
  Heart,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Calendar as CalendarIcon,
  CheckCircle2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// --- Types & Data ---

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'pizza' | 'drink' | 'dessert';
}

const MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita D.O.P',
    description: 'Tomate San Marzano, Mozzarella di Bufala, Manjericão fresco e Azeite Extra Virgem.',
    price: 68,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=600',
    category: 'pizza'
  },
  {
    id: '2',
    name: 'Diavola',
    description: 'Tomate, Mozzarella, Salame Picante Italiano e Cebola Roxa.',
    price: 74,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=600',
    category: 'pizza'
  },
  {
    id: '3',
    name: 'Nevorento Speciale',
    description: 'Creme de Pistache, Mortadella Bologna, Stracciatella e Raspas de Limão Siciliano.',
    price: 89,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    category: 'pizza'
  },
  {
    id: '4',
    name: 'Tiramisù Classico',
    description: 'Receita original com Mascarpone italiano e café selecionado.',
    price: 32,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600',
    category: 'dessert'
  }
];

const TIME_SLOTS = [
  '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

// --- Components ---

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reserve' | 'order'>('reserve');
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderStep, setOrderStep] = useState<'selection' | 'summary' | 'success'>('selection');

  useGSAP(() => {
    // Hero Entrance
    const tl = gsap.timeline();
    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.2
    })
    .from('.hero-sub', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-cta', {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.4');

    // Scroll Reveal
    const sections = gsap.utils.toArray('.reveal');
    sections.forEach((section: any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    // Marquee Animation
    gsap.to('.marquee-content', {
      xPercent: -50,
      ease: 'none',
      duration: 20,
      repeat: -1
    });
  }, { scope: containerRef });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === itemId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 glass py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold tracking-tighter text-gold">NEVORENTO</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest opacity-70">
          <a href="#inicio" className="hover:text-gold transition-colors">Início</a>
          <a href="#diferenciais" className="hover:text-gold transition-colors">Diferenciais</a>
          <a href="#sobre" className="hover:text-gold transition-colors">Sobre</a>
          <a href="#depoimentos" className="hover:text-gold transition-colors">Depoimentos</a>
        </nav>
        <div className="flex items-center gap-4">
          {cart.length > 0 && (
            <button 
              onClick={() => { setActiveTab('order'); setIsModalOpen(true); }}
              className="relative p-2 glass rounded-full hover:bg-white/10 transition-colors"
            >
              <ShoppingBag size={20} className="text-gold" />
              <span className="absolute -top-1 -right-1 bg-gold text-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            </button>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gold text-dark px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform"
          >
            RESERVAR / PEDIR
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative h-screen flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000" 
            alt="Pizza Napoletana" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/40 to-dark"></div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="hero-title text-5xl md:text-7xl font-display font-black leading-none mb-6 tracking-tighter">
            O DESPERTAR DOS <br />
            <span className="text-gold italic">SENTIDOS</span>
          </h1>
          <p className="hero-sub text-lg md:text-2xl font-light max-w-2xl mx-auto mb-10 opacity-80">
            Tradição napolitana elevada pelo fogo e pelo tempo.
          </p>
          <div className="hero-cta flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => { setActiveTab('order'); setIsModalOpen(true); }}
              className="bg-gold text-dark px-8 py-3 rounded-full font-bold text-base hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all"
            >
              PEDIR DELIVERY
            </button>
            <button 
              onClick={() => { setActiveTab('reserve'); setIsModalOpen(true); }}
              className="glass px-8 py-3 rounded-full font-bold text-base hover:bg-white/10 transition-all"
            >
              RESERVAR MESA
            </button>
          </div>
        </div>
      </section>

      {/* Authority Marquee */}
      <div className="py-12 border-y border-white/5 bg-surface overflow-hidden">
        <div className="marquee-content flex whitespace-nowrap gap-12 items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 text-lg font-display italic opacity-50">
              <Star className="text-gold w-6 h-6 fill-gold" />
              <span>EXPERIÊNCIA SENSORIAL</span>
              <Star className="text-gold w-6 h-6 fill-gold" />
              <span>FERMENTAÇÃO NATURAL</span>
              <Star className="text-gold w-6 h-6 fill-gold" />
              <span>TRADIÇÃO ARTESANAL</span>
            </div>
          ))}
        </div>
      </div>

      {/* Differentials - Bento Grid */}
      <section id="diferenciais" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="reveal mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-4">A ESSÊNCIA DO <span className="text-gold">FOGO</span></h2>
          <p className="opacity-60 max-w-xl mx-auto">Uma curadoria de elementos que elevam a gastronomia ao patamar de arte.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <div className="reveal bento-card md:col-span-2 flex flex-col justify-end relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=1000" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" 
              alt="Fermentação"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10">
              <Leaf className="text-gold mb-4 w-10 h-10" />
              <h3 className="text-3xl font-bold mb-2">Fermentação Natural</h3>
              <p className="opacity-70 max-w-md">Nossa massa descansa por 48h, resultando em uma pizza leve, saudável e de fácil digestão.</p>
            </div>
          </div>

          <div className="reveal bento-card flex flex-col justify-center items-center text-center">
            <Flame className="text-gold mb-4 w-12 h-12" />
            <h3 className="text-2xl font-bold mb-2">Forno a 450°C</h3>
            <p className="opacity-70">O calor intenso que cria a borda perfeita: aerada e levemente chamuscada.</p>
          </div>

          <div className="reveal bento-card flex flex-col justify-center">
            <Heart className="text-gold mb-4 w-10 h-10" />
            <h3 className="text-2xl font-bold mb-2">Ambiente Imersivo</h3>
            <p className="opacity-70">Um refúgio de luz suave e texturas orgânicas para celebrar a vida.</p>
          </div>

          <div className="reveal bento-card md:col-span-2 flex flex-col justify-end relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" 
              alt="Ingredientes"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10">
              <Pizza className="text-gold mb-4 w-10 h-10" />
              <h3 className="text-3xl font-bold mb-2">Ingredientes Premium</h3>
              <p className="opacity-70 max-w-md">Tomates San Marzano, Mozzarella di Bufala e azeites extra virgens selecionados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="reveal relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&q=80&w=1000" 
              alt="Chef preparando pizza" 
              className="rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 -right-8 glass p-6 rounded-2xl hidden md:block">
              <p className="text-gold font-display italic text-xl">"Onde o tempo se dissolve no sabor"</p>
            </div>
          </div>
          <div className="reveal">
            <h2 className="text-5xl font-black mb-8 leading-tight">O RESPEITO À <br /> <span className="text-gold">MATÉRIA-PRIMA</span></h2>
            <p className="text-lg opacity-70 mb-6">
              Na La Fiamma, a pizza é o resultado de uma coreografia silenciosa entre o homem e a natureza. Não buscamos a pressa, mas a perfeição que só o repouso e o calor ancestral podem conferir.
            </p>
            <p className="text-lg opacity-70 mb-8">
              Cada disco de massa é uma tela em branco, onde ingredientes de origem controlada desenham uma experiência que transcende o paladar e toca a alma.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-gold font-bold text-3xl mb-1">11+</h4>
                <p className="text-sm opacity-50 uppercase tracking-widest">Avaliações 5 Estrelas</p>
              </div>
              <div>
                <h4 className="text-gold font-bold text-3xl mb-1">48h</h4>
                <p className="text-sm opacity-50 uppercase tracking-widest">De Maturação</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="reveal text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4">O QUE DIZEM <span className="text-gold">NOSSOS CLIENTES</span></h2>
          <div className="flex justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="text-gold fill-gold w-5 h-5" />)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Marco Rossi",
              text: "Uma viagem sensorial completa. A leveza da massa e a profundidade dos sabores são incomparáveis.",
              source: "Crítica Gastronômica"
            },
            {
              name: "Giulia Bianchi",
              text: "O ambiente é tão envolvente quanto a pizza. Uma experiência que mexe com todos os sentidos.",
              source: "Lifestyle Magazine"
            },
            {
              name: "Luca Ferrari",
              text: "A verdadeira essência da Itália traduzida com elegância e modernidade. Simplesmente impecável.",
              source: "Gourmet Guide"
            }
          ].map((item, i) => (
            <div key={i} className="reveal glass p-8 rounded-3xl relative">
              <div className="text-gold mb-4"><Star className="fill-gold w-4 h-4 inline-block" /> 5.0</div>
              <p className="italic opacity-80 mb-6">"{item.text}"</p>
              <div className="flex justify-between items-center border-t border-white/10 pt-4">
                <span className="font-bold">{item.name}</span>
                <span className="text-xs opacity-40 uppercase tracking-widest">{item.source}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-dark/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl h-[85vh] glass rounded-[2rem] overflow-hidden flex flex-col md:flex-row"
            >
              {/* Sidebar / Tabs */}
              <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/10 p-8 flex flex-col gap-4">
                <button 
                  onClick={() => setActiveTab('reserve')}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'reserve' ? 'bg-gold text-dark font-bold' : 'hover:bg-white/5 opacity-60'}`}
                >
                  <CalendarIcon size={20} />
                  <span>RESERVAR MESA</span>
                </button>
                <button 
                  onClick={() => setActiveTab('order')}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'order' ? 'bg-gold text-dark font-bold' : 'hover:bg-white/5 opacity-60'}`}
                >
                  <ShoppingBag size={20} />
                  <span>PEDIR ONLINE</span>
                </button>
                
                <div className="mt-auto pt-8 border-t border-white/10 hidden md:block">
                  <p className="text-xs opacity-40 uppercase tracking-widest mb-4">Atendimento</p>
                  <p className="text-sm font-bold">Terça a Domingo</p>
                  <p className="text-sm opacity-60">18:30 às 23:00</p>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>

                {activeTab === 'reserve' ? (
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-4xl font-black mb-8">RESERVE SUA <span className="text-gold">EXPERIÊNCIA</span></h2>
                    
                    <div className="space-y-10">
                      {/* Date Selection */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] opacity-40 mb-4">1. Selecione a Data</label>
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                          {[...Array(14)].map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i);
                            const isSelected = selectedDate === date.toDateString();
                            return (
                              <button 
                                key={i}
                                onClick={() => setSelectedDate(date.toDateString())}
                                className={`p-3 rounded-xl border transition-all flex flex-col items-center ${isSelected ? 'bg-gold border-gold text-dark font-bold' : 'border-white/10 hover:border-gold/50'}`}
                              >
                                <span className="text-[10px] opacity-60 uppercase">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                                <span className="text-lg">{date.getDate()}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] opacity-40 mb-4">2. Selecione o Horário</label>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                          {TIME_SLOTS.map(time => (
                            <button 
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-4 rounded-xl border transition-all font-medium ${selectedTime === time ? 'bg-gold border-gold text-dark font-bold' : 'border-white/10 hover:border-gold/50'}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        disabled={!selectedDate || !selectedTime}
                        className="w-full bg-gold text-dark py-5 rounded-2xl font-black text-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        CONFIRMAR RESERVA
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    {orderStep === 'selection' && (
                      <>
                        <div className="flex justify-between items-end mb-12">
                          <div>
                            <h2 className="text-4xl font-black mb-2">NOSSO <span className="text-gold">MENU</span></h2>
                            <p className="opacity-50">Selecione as delícias que deseja receber em casa.</p>
                          </div>
                          {cart.length > 0 && (
                            <button 
                              onClick={() => setOrderStep('summary')}
                              className="bg-gold text-dark px-8 py-3 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-transform"
                            >
                              FINALIZAR PEDIDO <ChevronRight size={20} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {MENU.map(item => (
                            <div key={item.id} className="glass p-4 rounded-3xl flex gap-6 group">
                              <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                  <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                                  <p className="text-xs opacity-50 line-clamp-2">{item.description}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gold font-bold">R$ {item.price},00</span>
                                  <button 
                                    onClick={() => addToCart(item)}
                                    className="p-2 bg-gold/10 text-gold rounded-xl hover:bg-gold hover:text-dark transition-all"
                                  >
                                    <Plus size={20} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {orderStep === 'summary' && (
                      <div className="max-w-xl mx-auto w-full">
                        <button 
                          onClick={() => setOrderStep('selection')}
                          className="text-gold text-sm font-bold mb-8 flex items-center gap-2 hover:opacity-70 transition-opacity"
                        >
                          <ChevronRight size={16} className="rotate-180" /> VOLTAR AO MENU
                        </button>
                        
                        <h2 className="text-4xl font-black mb-8">RESUMO DO <span className="text-gold">PEDIDO</span></h2>
                        
                        <div className="space-y-6 mb-12">
                          {cart.map(item => (
                            <div key={item.item.id} className="flex items-center gap-6 glass p-4 rounded-2xl">
                              <div className="w-16 h-16 rounded-xl overflow-hidden">
                                <img src={item.item.image} alt={item.item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold">{item.item.name}</h4>
                                <p className="text-xs text-gold">R$ {item.item.price},00</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <button onClick={() => updateQuantity(item.item.id, -1)} className="p-1 hover:text-gold transition-colors"><Minus size={16} /></button>
                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.item.id, 1)} className="p-1 hover:text-gold transition-colors"><Plus size={16} /></button>
                              </div>
                              <button onClick={() => removeFromCart(item.item.id)} className="p-2 opacity-30 hover:opacity-100 hover:text-red-500 transition-all"><X size={18} /></button>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-white/10 pt-8 space-y-4">
                          <div className="flex justify-between text-sm opacity-50">
                            <span>Subtotal</span>
                            <span>R$ {cartTotal},00</span>
                          </div>
                          <div className="flex justify-between text-sm opacity-50">
                            <span>Taxa de Entrega</span>
                            <span>R$ 10,00</span>
                          </div>
                          <div className="flex justify-between text-2xl font-black pt-4">
                            <span>TOTAL</span>
                            <span className="text-gold">R$ {cartTotal + 10},00</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => setOrderStep('success')}
                          className="w-full bg-gold text-dark py-5 rounded-2xl font-black text-xl mt-12 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
                        >
                          FINALIZAR E PAGAR
                        </button>
                      </div>
                    )}

                    {orderStep === 'success' && (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mb-8"
                        >
                          <CheckCircle2 size={48} className="text-dark" />
                        </motion.div>
                        <h2 className="text-5xl font-black mb-4">PEDIDO <span className="text-gold">CONFIRMADO!</span></h2>
                        <p className="opacity-60 max-w-sm mb-12">Seu pedido já está sendo preparado com todo carinho. Em breve ele chegará até você.</p>
                        <button 
                          onClick={() => { setIsModalOpen(false); setOrderStep('selection'); setCart([]); }}
                          className="glass px-12 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
                        >
                          VOLTAR AO SITE
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-surface pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <span className="text-3xl font-display font-bold text-gold block mb-6 tracking-tighter">NEVORENTO</span>
            <p className="opacity-50 max-w-sm mb-8">
              Uma experiência conceitual de alta gastronomia italiana. Onde a tradição encontra o design e o paladar encontra a alma.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-gold">Localização</h4>
            <ul className="space-y-4 opacity-70 text-sm">
              <li className="flex items-center gap-3"><Phone size={16} className="text-gold" /> +55 (11) 98765-4321</li>
              <li className="flex items-start gap-3"><MapPin size={16} className="text-gold mt-1" /> Via della Luce, 120 <br /> Quartier Latino</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-gold">Horários</h4>
            <ul className="space-y-4 opacity-70 text-sm">
              <li className="flex items-center gap-3"><Clock size={16} className="text-gold" /> Terça a Domingo</li>
              <li className="ml-7">19:00 às 00:00</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40 uppercase tracking-[0.2em]">
          <p>© 2026 NEVORENTO PIZZARIA. PROJETO CONCEITUAL DESENVOLVIDO PARA FINS DE PORTFÓLIO.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a 
        href="#" 
        onClick={(e) => e.preventDefault()}
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <Phone size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold">
          CONTATO CONCEITUAL
        </span>
      </a>
    </div>
  );
}
