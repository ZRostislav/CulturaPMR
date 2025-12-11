import { motion } from 'motion/react';
import { Music, Theater, Palette, Users, Calendar, MapPin, Phone, Mail } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

export function Home() {
  const services = [
    {
      icon: <Theater size={32} />,
      title: 'Театральный зал',
      description: 'Современная сцена для театральных постановок и концертных выступлений',
      image: 'https://images.unsplash.com/photo-1761502479994-3a5e07ec243e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0aGVhdGVyJTIwaGFsbHxlbnwxfHx8fDE3NjU0NDExMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: <Music size={32} />,
      title: 'Концертный зал',
      description: 'Профессиональная акустика для музыкальных мероприятий любого формата',
      image: 'https://images.unsplash.com/photo-1631552256073-6556ced1cf15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwaGFsbCUyMGludGVyaW9yfGVufDF8fHx8MTc2NTQ0MTEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: <Palette size={32} />,
      title: 'Выставочная галерея',
      description: 'Просторные залы для художественных выставок и экспозиций',
      image: 'https://images.unsplash.com/photo-1643820509303-79e98ac7e006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwbXVzZXVtfGVufDF8fHx8MTc2NTQ0MTEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: <Users size={32} />,
      title: 'Конференц-залы',
      description: 'Оборудованные пространства для деловых встреч и мероприятий',
      image: 'https://images.unsplash.com/photo-1762780088259-568641a105ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGNlbnRlciUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2NTQ0MTEyNHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1764936394584-c4a66ac31e00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwcGVyZm9ybWFuY2UlMjBzdGFnZXxlbnwxfHx8fDE3NjU0MzQ4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1695067440629-b5e513976100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjUzNDE5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1761502479994-3a5e07ec243e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0aGVhdGVyJTIwaGFsbHxlbnwxfHx8fDE3NjU0NDExMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1631552256073-6556ced1cf15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwaGFsbCUyMGludGVyaW9yfGVufDF8fHx8MTc2NTQ0MTEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1643820509303-79e98ac7e006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwbXVzZXVtfGVufDF8fHx8MTc2NTQ0MTEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1762780088259-568641a105ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGNlbnRlciUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2NTQ0MTEyNHww&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  return (
    <div>
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
                      src="https://pridnestrovie-tourism.com/wp-content/uploads/2018/11/dji_0401.jpg"
            alt="Cultural Center"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950"></div>
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-white mb-6">
              Многофункциональный<br />Культурный Комплекс
            </h1>
            <p className="text-neutral-300 max-w-2xl mx-auto mb-8">
              Современное пространство для культурных мероприятий, творческих встреч и 
              вдохновляющих событий в самом сердце города
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
              >
                Связаться с нами
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20"
              >
                Узнать больше
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-neutral-900">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-white mb-6">О комплексе</h2>
            <p className="text-neutral-300">
              Наш культурный комплекс – это уникальное многофункциональное пространство, 
              где искусство встречается с современными технологиями. Мы создали место, 
              где каждый найдет что-то для себя: от классических театральных постановок 
              до современных художественных выставок.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-white" size={32} />
              </div>
              <h3 className="text-white mb-2">Более 200</h3>
              <p className="text-neutral-400">мероприятий в год</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-white mb-2"></h3>
              <p className="text-neutral-400"></p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white" size={32} />
              </div>
              <h3 className="text-white mb-2"></h3>
              <p className="text-neutral-400"></p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-neutral-950">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-white mb-4">Наши направления</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Разнообразие пространств для реализации любых культурных и деловых проектов
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 text-white">
                    {service.icon}
                  </div>
                  <h3 className="text-white mb-2">{service.title}</h3>
                  <p className="text-neutral-400">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-neutral-900">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-white mb-4">Галерея</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Взгляните на наши пространства и атмосферу
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="aspect-square overflow-hidden rounded-xl cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-24 bg-neutral-950">
        <div className="container mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-white mb-4">Контакты</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Свяжитесь с нами для аренды залов или получения дополнительной информации
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-white" size={24} />
              </div>
              <h3 className="text-white mb-2">Телефон</h3>
                          <p className="text-neutral-400"> 0 (552) 2-65-34</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-white" size={24} />
              </div>
              <h3 className="text-white mb-2">Email</h3>
                          <p className="text-neutral-400">yesmilka1994@mail.ru</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="text-white mb-2">Адрес</h3>
                          <p className="text-neutral-400">Приднестровье, г. Бендеры, ул. Ленина д. 32</p>
            </motion.div>
          </motion.div>

          <motion.div {...fadeInUp} className="mt-12 max-w-2xl mx-auto">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <textarea
                placeholder="Ваше сообщение"
                rows={4}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              ></textarea>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
              >
                Отправить сообщение
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
