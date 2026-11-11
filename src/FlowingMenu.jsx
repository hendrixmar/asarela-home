// Flowing menu, ported from the supplied TSX/Tailwind component to JSX + plain CSS (menus.css).
// On hover a marquee band (name + material swatch, looping) slides over the row from whichever
// edge the pointer crossed, and leaves through the edge it exits by.
import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './menus.css'

// ponytail: fixed repeat count with a CSS loop instead of measuring widths in JS.
// 8 parts of ~500px+ cover any viewport to ~3500px; raise it if rows ever get very short names.
const REPS = 8
const defaults = { duration: 0.6, ease: 'expo.out' }

function Row({ num, text, tags, image, link }) {
  const band = useRef(null)
  const inner = useRef(null)

  useLayoutEffect(() => {
    gsap.set(band.current, { yPercent: 101 })
  }, [])

  // band and its content move in opposite directions, so the content looks pinned while it is revealed
  const move = (e, entering) => {
    const r = e.currentTarget.getBoundingClientRect()
    const edge = e.clientY - r.top < r.height / 2 ? -101 : 101
    const tl = gsap.timeline({ defaults })
    if (entering) {
      tl.set(band.current, { yPercent: edge }, 0)
        .set(inner.current, { yPercent: -edge }, 0)
        .to([band.current, inner.current], { yPercent: 0 }, 0)
    } else {
      tl.to(band.current, { yPercent: edge }, 0).to(inner.current, { yPercent: -edge }, 0)
    }
  }

  return (
    <a className="list-item flow-item" href={link} onMouseEnter={(e) => move(e, true)} onMouseLeave={(e) => move(e, false)}>
      <span className="num">{num}</span>
      <span className="title">{text}</span>
      <span className="tags">{tags}</span>
      <div className="flow-band" ref={band} aria-hidden="true">
        <div className="flow-inner" ref={inner}>
          <div className="flow-track" style={{ '--reps': REPS }}>
            {Array.from({ length: REPS }, (_, i) => (
              <div className="flow-part" key={i}>
                <span>{text}</span>
                <div className="flow-pill" style={{ backgroundImage: `url(${image})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </a>
  )
}

export default function FlowingMenu({ items = [] }) {
  return (
    <section className="list-module" id="catalogo">
      {items.map((item, i) => (
        <Row key={item.text} num={String(i + 1).padStart(2, '0')} {...item} />
      ))}
    </section>
  )
}
