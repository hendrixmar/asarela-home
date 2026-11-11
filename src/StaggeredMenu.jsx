// GSAP staggered menu, ported from the supplied TSX/Tailwind component to JSX + plain CSS (menus.css).
// Trimmed to what this site uses: always fixed, always from the right, logo stays in the page nav.
// Added: links close the menu (they are in-page anchors), Escape closes, panel is inert while shut.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './menus.css'

export default function StaggeredMenu({
  items = [],
  socialItems = [],
  colors = ['#1a1a1b', '#2a2a2b', '#ffffff'], // layers that sweep in first; the last one is the panel
  displayItemNumbering = true,
}) {
  const [open, setOpen] = useState(false)
  const [textLines, setTextLines] = useState(['Menú', 'Cerrar'])
  const openRef = useRef(false)
  const rootRef = useRef(null)
  const panelRef = useRef(null)
  const btnRef = useRef(null)
  const textRef = useRef(null)
  const hRef = useRef(null)
  const vRef = useRef(null)
  const tlRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.sm-prelayer, .sm-panel', { xPercent: 100 })
      gsap.set(vRef.current, { rotate: 90 })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const toggle = useCallback((target = !openRef.current) => {
    if (target === openRef.current) return
    openRef.current = target
    setOpen(target)

    const q = gsap.utils.selector(rootRef)
    const layers = q('.sm-prelayer')
    const panel = q('.sm-panel')
    tlRef.current?.kill()

    if (target) {
      const labels = q('.sm-item-label')
      const socials = q('.sm-socials-title, .sm-socials a')
      gsap.set(labels, { yPercent: 140, rotate: 10 })
      gsap.set(socials, { y: 25, opacity: 0 })

      const tl = gsap.timeline()
      layers.forEach((el, i) => tl.to(el, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07))
      const panelAt = layers.length ? (layers.length - 1) * 0.07 + 0.08 : 0
      tl.to(panel, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, panelAt)
        .to(labels, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: 0.1 }, panelAt + 0.1)
        .to(socials, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.08 }, panelAt + 0.26)
      tlRef.current = tl
    } else {
      tlRef.current = gsap.to([...layers, ...panel], {
        xPercent: 100,
        duration: 0.35,
        ease: 'power3.in',
        stagger: { each: 0.05, from: 'end' },
        overwrite: 'auto',
      })
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) tlRef.current.progress(1)

    // plus turns into a cross; the label rolls Menú → ··· → Cerrar and back
    gsap.to(hRef.current, { rotate: target ? 45 : 0, duration: 0.5, ease: 'power4.out' })
    gsap.to(vRef.current, { rotate: target ? 135 : 90, duration: 0.5, ease: 'power4.out' })
    setTextLines(target ? ['Menú', '···', 'Cerrar'] : ['Cerrar', '···', 'Menú'])
    gsap.fromTo(textRef.current, { yPercent: 0 }, { yPercent: -200 / 3, duration: 0.5, ease: 'power4.out' })
  }, [])

  useEffect(() => {
    if (!open) return
    const away = (e) => {
      if (!panelRef.current.contains(e.target) && !btnRef.current.contains(e.target)) toggle(false)
    }
    const esc = (e) => e.key === 'Escape' && toggle(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open, toggle])

  return (
    <div className="sm" ref={rootRef}>
      <button
        ref={btnRef}
        className="sm-toggle"
        onClick={() => toggle()}
        aria-expanded={open}
        aria-controls="sm-panel"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        <span className="sm-toggle-text" aria-hidden="true">
          <span ref={textRef}>
            {textLines.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </span>
        </span>
        <span className="sm-icon" aria-hidden="true">
          <span ref={hRef} />
          <span ref={vRef} />
        </span>
      </button>

      <div className="sm-prelayers" aria-hidden="true">
        {colors.slice(0, -1).map((c, i) => (
          <div key={i} className="sm-prelayer" style={{ background: c }} />
        ))}
      </div>

      <aside id="sm-panel" ref={panelRef} className="sm-panel" style={{ background: colors.at(-1) }} inert={!open}>
        <nav>
          <ul>
            {items.map((item, i) => (
              <li key={item.link}>
                <a href={item.link} aria-label={item.ariaLabel} onClick={() => toggle(false)}>
                  {displayItemNumbering && <span className="num">{String(i + 1).padStart(2, '0')}</span>}
                  <span className="sm-item-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {socialItems.length > 0 && (
          <div className="sm-socials">
            <h3 className="sm-socials-title">Síguenos</h3>
            <ul>
              {socialItems.map((s) => (
                <li key={s.link}>
                  <a href={s.link} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  )
}
