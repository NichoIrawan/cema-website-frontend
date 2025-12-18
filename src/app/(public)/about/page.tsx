import Image from "next/image";
import Link from "next/link";
import "./about.css";

export const metadata = {
  title: "Tentang Kami - Cema Design",
  description:
    "Perjalanan Cema Design dari studio kecil hingga firma arsitektur terpercaya.",
};

export default function AboutPage() {
  const timelineData = [
    {
      year: "2016",
      title: "Awal Mula",
      desc: "Cema Design didirikan di sebuah garasi kecil dengan tim berisi 3 orang.",
      img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500",
    },
    {
      year: "2019",
      title: "Ekspansi Pertama",
      desc: "Membuka kantor cabang pertama dan menangani 100+ proyek residensial.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
    },
    {
      year: "2025",
      title: "Market Leader",
      desc: "Menjadi salah satu firma desain terpercaya dengan penghargaan nasional.",
      img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500",
    },
  ];

  const valuesData = [
    { title: "Inovasi", desc: "Selalu mencari cara baru dalam mendesain." },
    { title: "Integritas", desc: "Transparan dan jujur dalam setiap langkah." },
    { title: "Kolaborasi", desc: "Bekerja bersama klien untuk hasil terbaik." },
  ];

  return (
    <main>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="section-subtitle">Tentang Kami</p>
          <h1 className="section-title">
            Perjalanan <span>Cema Design</span>
          </h1>
          <p className="section-desc">
            Dari studio kecil hingga firma terpercaya.
            <br />
            Sebuah kisah passion, dedikasi, dan inovasi.
          </p>
          <div className="scroll-indicator"></div>
        </div>
      </header>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="mission box">
          <div className="icon">🎯</div>
          <h2>Misi Kami</h2>
          <p>
            Menciptakan ruang yang menginspirasi kehidupan yang lebih baik
            melalui desain inovatif dan berkelanjutan.
          </p>
        </div>
        <div className="vision box">
          <div className="icon">💡</div>
          <h2>Visi Kami</h2>
          <p>
            Menjadi firma arsitektur dan interior design terdepan di Indonesia
            yang dikenal dengan inovasi dan kualitas.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline">
        <h2>Perjalanan Kami</h2>
        <p>
          Dari tahun 2016 hingga sekarang, setiap langkah adalah cerita
          pertumbuhan dan pencapaian.
        </p>
        <div className="timeline-container">
          {timelineData.map((item, index) => (
            <div key={index} className="timeline-card">
              <div className="year-badge">{item.year}</div>
              {/* Menggunakan Next Image untuk Optimasi */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "200px",
                  margin: "20px 0",
                }}
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover", borderRadius: "15px" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="values">
        <h2>Nilai-Nilai Kami</h2>
        <p>Prinsip-prinsip yang menjadi fondasi setiap karya kami</p>
        <div className="values-grid">
          {valuesData.map((val, index) => (
            <div key={index} className="value-card">
              <h3>{val.title}</h3>
              <p>{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements">
        <div className="achievements-header">
          <h3>Cema Design Hari Ini</h3>
          <p>Pencapaian kami hingga tahun 2025</p>
        </div>

        <div className="achievements-cards">
          {/* Card Item */}
          <div className="achievement-card">
            <i className="fas fa-home"></i>
            <h2>750+</h2>
            <p>Proyek Selesai</p>
          </div>
          <div className="achievement-card">
            <i className="fas fa-users"></i>
            <h2>500+</h2>
            <p>Klien Puas</p>
          </div>
          <div className="achievement-card">
            <i className="fas fa-building"></i>
            <h2>80</h2>
            <p>Tim Profesional</p>
          </div>
          <div className="achievement-card">
            <i className="fas fa-award"></i>
            <h2>15+</h2>
            <p>Penghargaan</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Siap Memulai Proyek Bersama?</h2>
        <p>Mari wujudkan ruang impian Anda bersama tim profesional kami</p>
        <div className="cta-buttons">
          {/* Menggunakan Link component, bukan button dengan href */}
          <Link
            href="/contact"
            className="btn-outline"
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Jadwalkan Konsultasi
          </Link>
          <Link
            href="/contact"
            className="btn-outline"
            style={{
              display: "inline-block",
              textDecoration: "none",
              marginLeft: "10px",
            }}
          >
            Hubungi Kami
          </Link>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2>Lokasi Kami</h2>
        <p>Kunjungi kantor kami untuk konsultasi langsung</p>
        <div className="map-container">
          <iframe
            title="Lokasi Kantor Cema Design"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.912674222173!2d110.40842507493534!3d-7.799921277414429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a578dd2b86f11%3A0xd671d7c7b9c70f25!2sTelkom%20University!5e0!3m2!1sid!2sid!4v1697274060405!5m2!1sid!2sid"
            style={{ border: 0, width: "100%", height: "100%" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </main>
  );
}
