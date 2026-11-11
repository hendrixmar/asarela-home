import { Fragment, useEffect, useRef, useState } from 'react'
import MasonryGallery from './MasonryGallery'
import { CONTACT, Contact, Testimonials } from './Sections'
import StaggeredMenu from './StaggeredMenu'
import FlowingMenu from './FlowingMenu'
import markUrl from './logo-mark.svg'
import markSvg from './logo-mark.svg?raw'

// Illustrative material images generated with AI (public/img) — not photos of real Asarela projects.
const img = (name) => `${import.meta.env.BASE_URL}img/${name}.webp`

// Rows of the flowing menu. Each hover band shows an AI-generated close-up of that material
// (public/img/pattern-*.webp) and the row links to the contact section.
const LIST = [
  ['Viga WPC', 'Techos / Trabes', 'viga-wpc'],
  ['Deck WPC', 'Terrazas / Exteriores', 'deck-wpc'],
  ['Pasto y Follaje', 'Sintético / Jardín', 'pasto-follaje'],
  ['Simulación Madera', 'Acabados / Calidez', 'simulacion-madera'],
  ['Cocinas Integrales', 'A medida / Superficie sólida', 'cocina-integral'],
  ['Remodelaciones', 'Baños / Negocios / Oficinas', 'remodelaciones'],
].map(([text, tags, id]) => ({ text, tags, image: img(`pattern-${id}`), link: '#contacto' }))

const MENU = [
  { label: 'Productos', link: '#productos', ariaLabel: 'Ver productos' },
  { label: 'Materiales', link: '#proyectos', ariaLabel: 'Ver galería de materiales' },
  { label: 'Catálogo', link: '#catalogo', ariaLabel: 'Ver catálogo de acabados y servicios' },
  { label: 'Testimonios', link: '#testimonios', ariaLabel: 'Leer testimonios' },
  { label: 'Contacto', link: '#contacto', ariaLabel: 'Ir a contacto' },
]

const SOCIALS = [
  { label: 'WhatsApp', link: CONTACT.whatsapp },
  { label: 'Facebook', link: CONTACT.facebook },
  { label: 'Instagram', link: CONTACT.instagram },
  { label: 'TikTok', link: CONTACT.tiktok },
]

// height is relative to a 400-wide column: 267 = landscape 3:2, 600 = portrait 2:3
const GALLERY = [
  ['lambrin-wpc', 'Lambrín WPC', 267],
  ['marmol-pvc', 'Mármol PVC', 600],
  ['piso-spc', 'Piso vinílico SPC', 600],
  ['viga-wpc', 'Viga WPC', 267],
  ['roca-pu', 'Roca PU', 600],
  ['cocina-integral', 'Cocina integral', 267],
  ['deck-wpc', 'Deck WPC', 267],
  ['pasto-follaje', 'Pasto y follaje sintético', 600],
  ['plafon-pvc', 'Plafón PVC', 267],
  ['simulacion-madera', 'Simulación madera', 267],
].map(([id, title, height]) => ({ id, title, img: img(id), height }))

// Anniversary promo from the Facebook page: 9–30 November 2026. Hides itself afterwards.
const PROMO_ACTIVE = new Date() < new Date('2026-12-01T00:00:00-06:00')

// Each line is a list of [word, italic?]. Letters slide down out of a clip, one after another.
const HERO_LINES = [[['Transformamos'], ['tus', true]], [['espacios']]]

// The hero letters wait for the intro curtain to lift. Keep in sync with .intro in index.css.
const INTRO_S = 2.7

// Splash: the logo mark assembles bar by bar, the wordmark fades in, then the curtain lifts.
// Pure CSS (index.css); hidden entirely under prefers-reduced-motion.
function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-mark" dangerouslySetInnerHTML={{ __html: markSvg }} />
      <p className="intro-word">
        Asarela <span>Home</span>
      </p>
      <p className="intro-sub">Acabados Arquitectónicos</p>
    </div>
  )
}

function SlideDownText({ lines }) {
  let n = 0
  return lines.map((words, li) => (
    <span className="line" key={li} aria-hidden="true">
      {words.map(([word, italic], wi) => {
        const Word = italic ? 'em' : 'span'
        return (
          <Fragment key={wi}>
            {wi > 0 && ' '}
            <Word className="word">
              {[...word].map((ch, ci) => (
                <span className="char" key={ci}>
                  <span style={{ animationDelay: `${INTRO_S + n++ * 0.045}s` }}>{ch}</span>
                </span>
              ))}
            </Word>
          </Fragment>
        )
      })}
    </span>
  ))
}

function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    const cursor = ref.current
    const move = (e) => {
      cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
    }
    const enter = () => {
      cursor.style.transform += ' scale(4)'
      cursor.style.backgroundColor = 'var(--text)'
    }
    const leave = () => {
      cursor.style.transform = cursor.style.transform.replace(' scale(4)', '')
      cursor.style.backgroundColor = 'var(--accent)'
    }
    const targets = document.querySelectorAll('a, .square, .list-item')

    document.addEventListener('mousemove', move)
    targets.forEach((el) => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })
    return () => {
      document.removeEventListener('mousemove', move)
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
    }
  }, [])

  return <div id="cursor" ref={ref} />
}

function useImageParallax() {
  useEffect(() => {
    const onScroll = () => {
      document.querySelectorAll('.image-card').forEach((img) => {
        img.style.backgroundPositionY = `${Math.min(100, 50 + window.scrollY * 0.02)}%`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

function Square({ num, title, em, label, className = '', children }) {
  return (
    <div className={`square ${className}`}>
      <span className="num">{num}</span>
      <h2>
        {title} <em>{em}</em>
      </h2>
      {children}
      {label && <span className="meta-label">{label}</span>}
    </div>
  )
}

function ImageSquare({ src, className = '', children }) {
  return (
    <div className={`square image-card ${className}`} style={{ backgroundImage: `url('${src}')` }}>
      {children}
    </div>
  )
}

function Nav() {
  return (
    <nav>
      <a href="#productos">Productos</a>
      <a className="logo" href="#" aria-label="Asarela Home — inicio">
        <img src={markUrl} alt="" width="38" height="48" />
        ASARELA <br />
        HOME
      </a>
      <span />{/* the fixed menu toggle sits over this cell */}
    </nav>
  )
}

function Hero() {
  return (
    <header>
      <div className="stack-detail">
        {[120, 160, 200, 240].map((w, i) => (
          <div key={w} className="stack-line" style={{ width: w, opacity: [0.2, 0.4, 0.6, 1][i] }} />
        ))}
      </div>
      <span className="meta-label">Acabados Arquitectónicos — Huajuapan de León</span>
      <h1 aria-label="Transformamos tus espacios">
        <SlideDownText lines={HERO_LINES} />
      </h1>
    </header>
  )
}

function ProductGrid() {
  return (
    <section className="grid-container" id="productos">
      <Square num="01" title="Lambrín" em="WPC" label="Muros / Columnas / Cabeceras" />

      <ImageSquare src={img('lambrin-wpc')}>
        <div className="badge">
          {PROMO_ACTIVE ? '2º ANIVERSARIO — HASTA 15% DE DESCUENTO · 9 AL 30 DE NOV*' : '2 AÑOS TRANSFORMANDO ESPACIOS'}
        </div>
      </ImageSquare>

      <Square num="03" title="Mármol" em="PVC" label="Placa simulación mármol" />

      <Square num="04" title="Piso" em="SPC" label="Vinílico / Sobre tu loseta, sin demoler" />

      <ImageSquare className="double-width" src={img('cocina-integral')}>
        <div className="caption">
          <span className="num">05</span>
          <h2>
            Cocinas <em>integrales</em>
          </h2>
        </div>
      </ImageSquare>

      <Square num="06" title="Venta, asesoría" em="e instalación" label="Servicio completo" className="double-height">
        <div className="body">
          Casa, negocio u oficina: te asesoramos para elegir el acabado ideal, lo llevamos a tu
          domicilio y lo instalamos con mano de obra especializada. También remodelamos baños,
          recámaras y locales completos. Escríbenos y cotiza hoy.
        </div>
      </Square>

      <Square num="07" title="Roca" em="PU" className="dark">
        <div className="status-dot" />
      </Square>

      <ImageSquare className="double-width" src={img('deck-wpc')} />

      <Square num="08" title="Plafón" em="PVC" label="Techos" />
    </section>
  )
}

function Gallery() {
  return (
    <section className="gallery" id="proyectos">
      <span className="meta-label">Materiales — Acabados en tendencia</span>
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1}>
              <MasonryGallery items={GALLERY} animateFrom="bottom" stagger={0.08} hoverScale={0.96} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Oversized fluid wordmark: slides up out of a clip the first time it scrolls into view.
function BigHeading() {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <section className="big-heading-wrap">
      <h2 ref={ref} className={`big-heading ${shown ? 'is-shown' : ''}`}>
        <span>
          Asarela <em>Home</em>
        </span>
      </h2>
      <span className="meta-label">Calidad que se nota, diseño que enamora</span>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <div>
        <p>Asarela Home — Acabados Arquitectónicos</p>
        <p className="muted">
          Huajuapan de León, Oaxaca · Imágenes ilustrativas{PROMO_ACTIVE && ' · *Aplican restricciones'}
        </p>
      </div>
      <div className="footer-links">
        <a href="#productos">Productos</a>
        <a href="#testimonios">Testimonios</a>
        <a href="#contacto">Contacto</a>
      </div>
    </footer>
  )
}

export default function App() {
  useImageParallax()

  return (
    <>
      <Intro />
      <Cursor />
      <StaggeredMenu items={MENU} socialItems={SOCIALS} colors={['#1A1A1A', '#B8975A', '#FBFAF7']} />
      <div className="master-grid">
        {Array.from({ length: 12 }, (_, i) => (
          <div className="grid-col" key={i} />
        ))}
      </div>
      <div className="content-overlay">
        <Nav />
        <Hero />
        <ProductGrid />
        <Gallery />
        <FlowingMenu items={LIST} />
        <Testimonials />
        <Contact />
        <BigHeading />
        <Footer />
      </div>
    </>
  )
}
