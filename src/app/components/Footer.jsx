export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            MyWebsite
          </h2>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-sm">
            We build real-world projects with clean code, scalable design,
            and practical thinking — not just copy-paste tutorials.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            {["Home", "About", "Projects", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                  className="group inline-flex items-center gap-2 hover:text-sky-400 transition-all duration-200"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500 opacity-0 group-hover:opacity-100 transition" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            Contact
          </h3>
          <p className="text-sm text-gray-400">
            📧 hello@mywebsite.com
          </p>
          <p className="text-sm text-gray-400 mt-2">
            📍 India
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-5">
            {["GitHub", "LinkedIn", "Twitter"].map((social) => (
              <span
                key={social}
                className="text-xs px-3 py-1 border border-gray-700 rounded-full cursor-pointer hover:border-sky-500 hover:text-sky-400 transition"
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <p className="text-center text-xs text-gray-500 py-5 tracking-wide">
          © {new Date().getFullYear()} MyWebsite — Built with focus, not fluff.
        </p>
      </div>
    </footer>
  );
}
