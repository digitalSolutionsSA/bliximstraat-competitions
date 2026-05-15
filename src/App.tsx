import { useState, useRef, FormEvent } from 'react'
import styles from './App.module.css'

interface FormData {
  naam: string
  kontakNommer: string
  epos: string
  liedjieNaam: string
}

interface FormErrors {
  naam?: string
  kontakNommer?: string
  epos?: string
  liedjieNaam?: string
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    naam: '',
    kontakNommer: '',
    epos: '',
    liedjieNaam: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.naam.trim()) newErrors.naam = 'Vul asseblief jou naam in.'
    if (!formData.kontakNommer.trim()) newErrors.kontakNommer = 'Vul asseblief jou kontaknommer in.'
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.kontakNommer.trim())) {
      newErrors.kontakNommer = 'Voer \'n geldige nommer in.'
    }
    if (!formData.epos.trim()) newErrors.epos = 'Vul asseblief jou e-posadres in.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.epos.trim())) {
      newErrors.epos = 'Voer \'n geldige e-posadres in.'
    }
    if (!formData.liedjieNaam.trim()) newErrors.liedjieNaam = 'Vul asseblief die liedjienaam in.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setSubmitError('')
    try {
      const res = await fetch('/.netlify/functions/send-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Fout')
      setSubmitted(true)
    } catch {
      setSubmitError('Iets het fout gegaan. Probeer asseblief weer.')
    } finally {
      setLoading(false)
    }
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className={styles.page}>
      {/* ── HERO VIDEO SECTION ── */}
      <section className={styles.hero}>
        <video
          className={styles.heroBg}
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.heroOverlay} />

        {/* Neon light beams */}
        <div className={`${styles.beam} ${styles.beamLeft}`} />
        <div className={`${styles.beam} ${styles.beamRight}`} />

        <div className={styles.heroContent}>
          <img src="/logo.png" alt="Blixim Straat" className={styles.logo} />

          <div className={styles.tagline}>
            <span className={styles.taglineAccent}>VIND DIE LIRIEKE</span>
          </div>

          <h1 className={styles.songTitle}>"SAGTE HANDE"</h1>

          <p className={styles.heroBody}>
            In een van ons liedjies skuil die frase <strong>"Sagte Hande"</strong>.<br />
            Weet jy watter lied dit is? Stuur ons die naam saam met jou<br />
            kontakbesonderhede — en staan kans om
          </p>

          <div className={styles.prizeBox}>
            <span className={styles.prizeLabel}>KONTANT TE WEN</span>
            <span className={styles.prizeAmount}>R 2 000<span className={styles.priceCents}>.00</span></span>
          </div>

          <button className={styles.ctaBtn} onClick={scrollToForm}>
            <span>SKRYF NOU IN!!</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>

          <p className={styles.tAndC}>Terme en voorwaardes geld.</p>
        </div>
      </section>

      {/* ── FORM SECTION ── */}
      <section className={styles.formSection} ref={formRef}>
        <div className={styles.formGlow} />

        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.formHeaderLine} />
            <h2 className={styles.formTitle}>INSKRYWINGSVORM</h2>
            <div className={styles.formHeaderLine} />
          </div>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>INSKRYWING ONTVANG!</h3>
              <p className={styles.successBody}>
                Dankie vir jou inskrywing. Ons sal jou kontak as jy wen.<br />
                Sterkte! 🎵
              </p>
              <button
                className={styles.ctaBtn}
                onClick={() => { setSubmitted(false); setFormData({ naam: '', kontakNommer: '', epos: '', liedjieNaam: '' }) }}
              >
                NOG 'N INSKRYWING
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="naam">NAAM EN VAN</label>
                  <input
                    id="naam"
                    type="text"
                    className={`${styles.input} ${errors.naam ? styles.inputError : ''}`}
                    placeholder="Jou volle naam"
                    value={formData.naam}
                    onChange={e => setFormData(p => ({ ...p, naam: e.target.value }))}
                  />
                  {errors.naam && <span className={styles.error}>{errors.naam}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="kontakNommer">KONTAK NOMMER</label>
                  <input
                    id="kontakNommer"
                    type="tel"
                    className={`${styles.input} ${errors.kontakNommer ? styles.inputError : ''}`}
                    placeholder="+27 82 000 0000"
                    value={formData.kontakNommer}
                    onChange={e => setFormData(p => ({ ...p, kontakNommer: e.target.value }))}
                  />
                  {errors.kontakNommer && <span className={styles.error}>{errors.kontakNommer}</span>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="epos">E-POSADRES</label>
                  <input
                    id="epos"
                    type="email"
                    className={`${styles.input} ${errors.epos ? styles.inputError : ''}`}
                    placeholder="jy@voorbeeld.co.za"
                    value={formData.epos}
                    onChange={e => setFormData(p => ({ ...p, epos: e.target.value }))}
                  />
                  {errors.epos && <span className={styles.error}>{errors.epos}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="liedjieNaam">LIEDJIE NAAM</label>
                  <input
                    id="liedjieNaam"
                    type="text"
                    className={`${styles.input} ${errors.liedjieNaam ? styles.inputError : ''}`}
                    placeholder="Die naam van die liedjie..."
                    value={formData.liedjieNaam}
                    onChange={e => setFormData(p => ({ ...p, liedjieNaam: e.target.value }))}
                  />
                  {errors.liedjieNaam && <span className={styles.error}>{errors.liedjieNaam}</span>}
                </div>
              </div>

              <div className={styles.formFooter}>
                <p className={styles.tAndCSmall}>
                  Deur in te skryf stem jy in met ons terme en voorwaardes.
                </p>
                {submitError && <p className={styles.error}>{submitError}</p>}
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    <>
                      <span>STUUR INSKRYWING</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <img src="/logo.png" alt="Blixim Straat" className={styles.footerLogo} />
        <p className={styles.footerText}>© {new Date().getFullYear()} Blixim Straat. Alle regte voorbehou.</p>
        <p className={styles.footerText}>Terme en voorwaardes geld.</p>
      </footer>
    </div>
  )
}
