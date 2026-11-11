// GSAP masonry gallery, ported from the supplied TSX/Tailwind component to JSX + plain CSS
// (styles live in index.css under .masonry*).
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

// The marquee track is never narrower than 700px (index.css), so 3 columns is the floor —
// fewer would stack ten full-width images into a six-screen-tall strip on phones.
const QUERIES = ['(min-width: 1500px)', '(min-width: 1000px)']
const COLUMNS = [5, 4]
const GAP = 24

function useColumns() {
  const get = () => COLUMNS[QUERIES.findIndex((q) => window.matchMedia(q).matches)] ?? 3
  const [value, setValue] = useState(get)

  useEffect(() => {
    const handler = () => setValue(get)
    const lists = QUERIES.map((q) => window.matchMedia(q))
    lists.forEach((l) => l.addEventListener('change', handler))
    return () => lists.forEach((l) => l.removeEventListener('change', handler))
  }, [])

  return value
}

const preloadImages = (urls) =>
  Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = img.onerror = resolve
          img.src = src
        }),
    ),
  )

export default function MasonryGallery({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  className = '',
  itemClassName = '',
}) {
  const columns = useColumns()
  const containerRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [imagesReady, setImagesReady] = useState(false)
  const [inView, setInView] = useState(false)
  const hasMounted = useRef(false)

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Hold the entrance until the gallery scrolls into view, otherwise nobody sees it.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    })
    io.observe(containerRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true))
  }, [items])

  const { grid, containerHeight } = useMemo(() => {
    if (!width) return { grid: [], containerHeight: 0 }

    const colHeights = new Array(columns).fill(0)
    const columnWidth = (width - (columns - 1) * GAP) / columns

    const grid = items.map((item) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const h = (item.height / 400) * columnWidth
      const y = colHeights[col]
      colHeights[col] += h + GAP
      return { ...item, x: col * (columnWidth + GAP), y, w: columnWidth, h }
    })

    return { grid, containerHeight: Math.max(...colHeights) }
  }, [columns, items, width])

  const initialPosition = (item) => {
    const rect = containerRef.current.getBoundingClientRect()
    const direction =
      animateFrom === 'random' ? ['top', 'bottom', 'left', 'right'][Math.floor(Math.random() * 4)] : animateFrom

    switch (direction) {
      case 'top': return { x: item.x, y: -200 }
      case 'bottom': return { x: item.x, y: window.innerHeight + 200 }
      case 'left': return { x: -200, y: item.y }
      case 'right': return { x: window.innerWidth + 200, y: item.y }
      case 'center': return { x: rect.width / 2 - item.w / 2, y: rect.height / 2 - item.h / 2 }
      default: return { x: item.x, y: item.y + 100 }
    }
  }

  useLayoutEffect(() => {
    if (!imagesReady || !inView || !grid.length) return

    grid.forEach((item, index) => {
      // Scoped to this container so several galleries can share item ids.
      const element = containerRef.current.querySelector(`[data-key="${item.id}"]`)
      if (!element) return

      const target = { x: item.x, y: item.y, width: item.w, height: item.h }

      if (!hasMounted.current) {
        const start = initialPosition(item)
        gsap.fromTo(
          element,
          { opacity: 0, x: start.x, y: start.y, width: item.w, height: item.h, ...(blurToFocus && { filter: 'blur(20px)' }) },
          { opacity: 1, ...target, ...(blurToFocus && { filter: 'blur(0px)' }), duration: 1.2, ease: 'power3.out', delay: index * stagger },
        )
      } else {
        gsap.to(element, { ...target, duration, ease, overwrite: 'auto' })
      }
    })

    hasMounted.current = true
  }, [grid, imagesReady, inView, stagger, animateFrom, blurToFocus, duration, ease])

  const hover = (element, entering) => {
    if (scaleOnHover) gsap.to(element, { scale: entering ? hoverScale : 1, duration: 0.4, ease: 'power2.out' })
    if (colorShiftOnHover) {
      gsap.to(element.querySelector('.masonry-overlay'), { opacity: entering ? 0.3 : 0, duration: 0.4 })
    }
  }

  return (
    <div ref={containerRef} className={`masonry ${className}`} style={{ height: containerHeight, minHeight: 400 }}>
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className={`masonry-item ${itemClassName}`}
          onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
          onMouseEnter={(e) => hover(e.currentTarget, true)}
          onMouseLeave={(e) => hover(e.currentTarget, false)}
        >
          <div className="masonry-img" style={{ backgroundImage: `url(${item.img})` }}>
            {colorShiftOnHover && <div className="masonry-overlay" />}
          </div>
          {item.title && (
            <div className="masonry-title">
              <p>{item.title}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
