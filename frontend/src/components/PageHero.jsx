import React, { useState } from "react";

/**
 * Shared hero banner used on Products, Varieties, About, Contact, Cart and Wishlist.
 * Pass a bgImage prop to use a single static background image instead of the
 * default slideshow.
 */
export default function PageHero({ breadcrumb, title, subtitle, bgImage, mobileBgImage, mobilePosition }) {
  const [heroImgError, setHeroImgError] = useState(false);

  const staticClass = mobilePosition
    ? `page-hero-v2-static page-hero-v2-static-${mobilePosition}`
    : "page-hero-v2-static";

  return (
    <section className="page-hero-v2">
      {bgImage ? (
        <>
          <div className={staticClass} style={{ backgroundImage: `url("${bgImage}")` }} />
          {mobileBgImage && (
            <div className="page-hero-v2-static-mobile" style={{ backgroundImage: `url("${mobileBgImage}")` }} />
          )}
        </>
      ) : (
        <div className="page-hero-v2-slides">
          <div className="page-hero-v2-slide page-hero-v2-slide-1">
            <img src={heroImgError ? "/images/Logo.png" : encodeURI("/images/hero/home hero kushal namkeen.png")} alt="" onError={() => setHeroImgError(true)} />
          </div>
          <div className="page-hero-v2-slide page-hero-v2-slide-2">
            <img src={heroImgError ? "/images/Logo.png" : encodeURI("/images/hero/home hero makai and diet.png")} alt="" onError={() => setHeroImgError(true)} />
          </div>
        </div>
      )}
      <div className="page-hero-v2-overlay" />
      <div className="container page-hero-v2-inner">
        <div className="page-hero-v2-copy">
          <div className="breadcrumb">{breadcrumb}</div>
          <h1>{title}</h1>
          <div className="hero-underline" />
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
