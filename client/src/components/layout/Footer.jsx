import { Link } from 'react-router-dom';
import { Zap, Link as LinkIcon, MessageCircle, Mail } from 'lucide-react';

/**
 * Footer — clean, professional landing page footer.
 */
const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Product: [
      { label: 'Features', href: '/#features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Changelog', href: '#' },
    ],
    Company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
    ],
    Legal: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="border-t border-white/8 bg-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Drop<span className="gradient-text-purple">Share</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Instant, real-time file sharing for teams. No sign-up required for guests. Just create a room and share.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: LinkIcon, href: '#' },
                { icon: MessageCircle, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href + Icon.displayName}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                {group}
              </p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">© {year} DropShare. All rights reserved.</p>
          <p className="text-sm text-slate-600">Built with ❤️ for teams everywhere</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
