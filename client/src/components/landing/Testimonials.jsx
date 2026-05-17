import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Avatar from '../ui/Avatar';

const testimonials = [
  {
    name: 'Aman Verma',
    role: 'Full Stack Developer',
    avatar: '',
    rating: 5,
    text: 'DropShare replaced our old workflow of emailing files back and forth. Now I just create a room, share the link in Slack, and everyone can see the files in seconds.',
  },
  {
    name: 'Priya Sharma',
    role: 'UI/UX Designer',
    avatar: '',
    rating: 5,
    text: 'The file preview feature is incredible. Clients can view design mockups and videos right in the browser without downloading anything. Game changer.',
  },
  {
    name: 'Rahul Gupta',
    role: 'Product Manager',
    avatar: '',
    rating: 5,
    text: 'We use it for sprint reviews — designers drop assets, engineers pick them up instantly. The live presence indicator shows who\'s in the room.',
  },
  {
    name: 'Sneha Joshi',
    role: 'DevOps Engineer',
    avatar: '',
    rating: 5,
    text: 'Used it to share deployment scripts during an incident. Everyone had the files in under a second. Absolute lifesaver when speed matters.',
  },
];

/**
 * Testimonials — horizontal scroll row of review cards.
 */
const Testimonials = () => {
  return (
    <section className="py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-amber-400 uppercase tracking-widest">Testimonials</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Loved by developers & teams
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-hover rounded-2xl p-6 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-300 leading-relaxed flex-1">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/8">
                <Avatar name={t.name} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
