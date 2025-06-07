import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import './App.css'

const sections = [
  { key: "hero", label: "Accueil" },
  { key: "about", label: "À propos" },
  { key: "products", label: "Produits" },
  { key: "custom", label: "Sur-mesure" },
  { key: "contact", label: "Contact" },
];

const scrollToSection = (ref) => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};

function ProductCard({ image, title, desc, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="card"
      style={{
        minHeight: 120,
        minWidth: 260,
        maxWidth: 520,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 auto"
      }}
    >
      <img src={image} alt={title} className="product-img" />
      <div style={{ padding: "1em 1.2em", width: "100%", textAlign: "center" }}>
        <h3>{title}</h3>
        <p style={{ fontSize: "0.98em", color: "#444" }}>{desc}</p>
      </div>
    </motion.div>
  );
}

const SectionContent = ({ section }) => {
  switch (section) {
    case "hero":
      return (
        <section className="section" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <h1>🪟 Des stores en fibre <span style={{ fontWeight: 700 }}>modernes</span></h1>
          <p style={{ fontSize: "1.2em", maxWidth: 500, textAlign: "center", marginBottom: 30 }}>Sublimez votre balcon avec nos toiles sur-mesure, minimalistes et résistantes.</p>
          <button>Voir les produits</button>
        </section>
      );
    case "about":
      return (
        <section className="section" style={{ textAlign: "center" }}>
          <h2>ℹ️ À propos des toldos</h2>
          <p style={{ maxWidth: 600, margin: "0 auto", fontSize: "1.1em" }}>
            Nos stores en fibre sont conçus pour durer, alliant esthétique moderne et fonctionnalité. Chaque modèle est pensé pour s'intégrer harmonieusement à votre espace extérieur.
          </p>
        </section>
      );
    case "flavors":
      if (activeFlavor) {
        return (
          <section className="section">
            <button onClick={handleBackToFlavors} style={{ marginBottom: 20, fontSize: 14 }}>&larr; Retour aux familles</button>
            <h2>🎨 {toldoFlavors.find(f => f.key === activeFlavor)?.name}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.2em", justifyItems: "center" }}>
              {(flavorVariations[activeFlavor] || []).map((prod, i) => (
                <ProductCard key={prod.title} {...prod} index={i} />
              ))}
            </div>
          </section>
        );
      }
      return (
        <section className="section">
          <h2>🎨 Toldo Flavors</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5em", justifyItems: "center" }}>
            {toldoFlavors.map(f => (
              <div key={f.key} className="flavor-card" onClick={() => handleFlavorClick(f.key)}>
                <h3>{f.name}</h3>
                <p style={{ fontSize: "0.97em", color: "#444" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case "products":
      return (
        <section className="section">
          <h2 style={{ fontWeight: 400, fontSize: "2em", marginBottom: 30, textAlign: "center" }}>Nos produits</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2em" }}>
            <div style={{ background: "#fafafa", borderRadius: 18, boxShadow: "0 2px 8px #0001", overflow: "hidden", transition: "transform 0.2s" }}>
              <img src="/vite.svg" alt="Toldo prototype" style={{ width: "100%", height: 120, objectFit: "cover" }} />
              <div style={{ padding: "1.2em" }}>
                <h3 style={{ fontWeight: 500, fontSize: "1.1em", marginBottom: 6 }}>Toldo Classique</h3>
                <p style={{ fontSize: "0.98em", color: "#444" }}>Store en fibre tissée, format bannière, idéal pour balcons modernes.</p>
              </div>
            </div>
          </div>
        </section>
      );
    case "custom":
      return (
        <section className="section" style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: 400, fontSize: "2em", marginBottom: 10 }}>Commande sur-mesure</h2>
          <form style={{ display: "inline-flex", gap: 10, marginTop: 10 }}>
            <input type="text" placeholder="Votre besoin (dimensions, couleur...)" style={{ padding: "0.5em 1em", border: "1px solid #ccc", borderRadius: 8, minWidth: 220 }} />
            <button type="submit">Envoyer</button>
          </form>
        </section>
      );
    case "contact":
      return (
        <section className="section" style={{ textAlign: "center" }}>
          <h2 style={{ fontWeight: 400, fontSize: "2em", marginBottom: 10 }}>Contact</h2>
          <p>contact@toldos-store.com</p>
        </section>
      );
    default:
      return null;
  }
};

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [activeFlavor, setActiveFlavor] = useState(null);
  const [navShrink, setNavShrink] = useState(false);
  const navRef = useRef();

  useEffect(() => {
    const onScroll = () => {
      setNavShrink(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (key) => {
    if (key === activeSection) return;
    const currentIdx = sections.findIndex(s => s.key === activeSection);
    const nextIdx = sections.findIndex(s => s.key === key);
    setDirection(nextIdx > currentIdx ? 1 : -1);
    setActiveSection(key);
  };

  return (
    <div style={{ background: "#fff", color: "#111", minHeight: "100vh" }}>
      <nav ref={navRef} className={navShrink ? "shrink" : ""}>
        <span>Toldos Store</span>
        <div style={{ display: "flex", gap: "1.5em", fontSize: 15 }}>
          {sections.map(s => (
            <a
              key={s.key}
              href={`#${s.key}`}
              onClick={e => { e.preventDefault(); handleNav(s.key); }}
              className={activeSection === s.key ? "active" : ""}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSection}
          initial={{ x: direction > 0 ? 80 : -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -80 : 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <SectionContent section={activeSection} />
        </motion.div>
      </AnimatePresence>
      <footer style={{ textAlign: "center", fontSize: 13, color: "#888", padding: "2em 0 1em 0" }}>
        &copy; {new Date().getFullYear()} Toldos Store. Tous droits réservés.
      </footer>
    </div>
  );
}
