import './sections.css'

export const CONTACT = {
  phone: '953 106 3658',
  tel: '+529531063658',
  email: 'asarela.acabadosarq@gmail.com',
  address: 'Venustiano Carranza 3, Centro, 69000 Huajuapan de León, Oaxaca',
  maps: 'https://www.google.com/maps/search/?api=1&query=Venustiano+Carranza+3+Centro+Huajuapan+de+Le%C3%B3n+Oaxaca',
  facebook: 'https://www.facebook.com/p/Asarela-Home-Acabados-Arquitect%C3%B3nicos-61568669585348/',
  instagram: 'https://www.instagram.com/asarelahome',
  tiktok: 'https://www.tiktok.com/@asarelahome',
  // Assumes the page's phone number is on WhatsApp. public/img/whatsapp-qr.svg encodes this exact
  // URL — regenerate it if the number or message changes:
  //   npx qrcode -t svg -o public/img/whatsapp-qr.svg "<url>" </dev/null
  whatsapp: 'https://wa.me/529531063658?text=Hola%2C%20quiero%20cotizar%20un%20proyecto',
}

// PLACEHOLDERS — the Facebook page has no reviews yet. Replace every entry with a real
// customer's words (with their permission) before publishing, and drop `sample` to remove the tag.
const TESTIMONIALS = [
  'Lambrín WPC', 'Piso vinílico SPC', 'Cocina integral', 'Mármol PVC', 'Plafón PVC',
  'Remodelación de baño', 'Deck WPC', 'Roca PU', 'Viga WPC', 'Pasto sintético',
].map((project) => ({
  name: 'Nombre del Cliente',
  project,
  quote: `Espacio reservado para la opinión real de un cliente sobre su proyecto de ${project.toLowerCase()}.`,
  sample: true,
}))

const initials = (name) =>
  name.split(/\s+/).filter((w) => /^\p{Lu}/u.test(w)).slice(0, 2).map((w) => w[0]).join('')

function TestimonialCard({ name, project, quote, sample }) {
  return (
    <figure className="t-card">
      <blockquote>“{quote}”</blockquote>
      <figcaption>
        <span className="t-avatar" aria-hidden="true">{initials(name)}</span>
        <span>
          <strong>{name}</strong>
          <small>{project} · Huajuapan</small>
        </span>
        {sample && <span className="t-sample">Ejemplo</span>}
      </figcaption>
    </figure>
  )
}

// Two rails scrolling in opposite directions. Each rail renders its cards twice so a
// translateX(-50%) loops seamlessly; the copy is aria-hidden.
export function Testimonials() {
  const half = Math.ceil(TESTIMONIALS.length / 2)
  const rows = [TESTIMONIALS.slice(0, half), TESTIMONIALS.slice(half)]

  return (
    <section className="testimonials" id="testimonios">
      <span className="meta-label">Testimonios</span>
      <h2>
        Lo que dicen <em>nuestros clientes</em>
      </h2>
      <div className="t-rows">
        {rows.map((cards, r) => (
          <div className={`t-row ${r % 2 ? 'reverse' : ''}`} key={r}>
            {[0, 1].map((copy) => (
              <div className="t-set" key={copy} aria-hidden={copy === 1}>
                {cards.map((t) => (
                  <TestimonialCard key={t.project} {...t} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section className="contact" id="contacto">
      <div className="contact-info">
        <span className="meta-label">Contacto</span>
        <h2>
          Hablemos de <em>tu proyecto</em>
        </h2>
        <dl>
          <div>
            <dt>Teléfono</dt>
            <dd>
              <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
            </dd>
          </div>
          <div>
            <dt>Correo</dt>
            <dd>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </dd>
          </div>
          <div>
            <dt>Visítanos</dt>
            <dd>
              <a href={CONTACT.maps} target="_blank" rel="noreferrer">{CONTACT.address}</a>
            </dd>
          </div>
          <div>
            <dt>Servicio</dt>
            <dd>Entrega a domicilio · Retiro en el negocio · Compras en tienda</dd>
          </div>
          <div>
            <dt>Redes</dt>
            <dd className="contact-social">
              <a href={CONTACT.facebook} target="_blank" rel="noreferrer">Facebook</a>
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a href={CONTACT.tiktok} target="_blank" rel="noreferrer">TikTok</a>
            </dd>
          </div>
        </dl>
      </div>
      <a className="contact-qr" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
        <span className="meta-label">
          <span className="status-dot" />
          WhatsApp
        </span>
        <img src={`${import.meta.env.BASE_URL}img/whatsapp-qr.svg`} alt="Código QR para escribirnos por WhatsApp" width="220" height="220" />
        <span className="contact-qr-text">Escanea el código o toca aquí para cotizar por WhatsApp</span>
      </a>
    </section>
  )
}
