import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiMessageCircle, FiChevronDown } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";
import { categoryMatches } from "../utils/catalogHelpers";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

function normaliseSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

export default function Products() {
  const { products, categoryGroups, allSelectableLabels, settings, pages } = useCatalog();
  const productsHero = (pages.products || {}).hero || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category");
  const [activeFilter, setActiveFilter] = useState(
    categoryFromUrl && allSelectableLabels.includes(categoryFromUrl)
      ? categoryFromUrl
      : "All Products"
  );
  const [search, setSearch] = useState(initialSearch);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    const cat = searchParams.get("category");
    if (cat && allSelectableLabels.includes(cat)) setActiveFilter(cat);
    else setActiveFilter("All Products");
  }, [searchParams, allSelectableLabels]);

  useEffect(() => {
    if (!openDropdown) return;
    function onDocClick(e) {
      if (!e.target.closest(".filter-dropdown")) setOpenDropdown(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [openDropdown]);

  function selectFilter(f) {
    setActiveFilter(f);
    setOpenDropdown(null);
    const next = new URLSearchParams(searchParams);
    if (f === "All Products") next.delete("category");
    else next.set("category", f);
    setSearchParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    let list = products;
    if (activeFilter !== "All Products") {
      list = list.filter((p) => categoryMatches(p.category, activeFilter, categoryGroups));
    }
    if (search.trim()) {
      // Match every word across the searchable product details. This makes
      // searches forgiving for punctuation, case, accents and phrases.
      const terms = normaliseSearchText(search).trim().split(/\s+/).filter(Boolean);
      list = list.filter((p) => {
        const searchable = normaliseSearchText([
          p.name, p.category, p.description, p.badge, p.ingredients, p.unit,
          ...(p.sizes || []),
          ...(p.sizeOptions || []).flatMap((size) => [size?.size, size?.price]),
        ].join(" "));
        return terms.every((term) => searchable.includes(term));
      });
    }
    return list;
  }, [products, categoryGroups, activeFilter, search]);

  return (
    <div>
      <Seo
        title={productsHero.title || "Our Product Collection"}
        description="Browse the full range of R&R Food Products (Riya and Rakshya Food Products) — authentic Nepali namkeen, chips, noodles, and snacks made in Bhairahawa, Nepal."
        path="/products"
      />
      <PageHero
        breadcrumb={productsHero.breadcrumb || "HOME > PRODUCTS"}
        title={productsHero.title || "Our Product Collection"}
        subtitle={productsHero.subtitle || "Discover our complete range of authentic, premium snacks crafted for the perfect crunch."}
        bgImage={productsHero.bgImage || "/images/productswishlisthero.png"}
      />

      <div className="container products-page" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="products-toolbar">
          <div className="filter-row">
            {categoryGroups.map((g) => {
              const isActiveGroup =
                activeFilter === g.label ||
                (g.options && g.options.some((o) => o.label === activeFilter));

              if (!g.options) {
                return (
                  <button
                    key={g.label}
                    className={`filter-pill ${activeFilter === g.label ? "active" : ""}`}
                    onClick={() => selectFilter(g.label)}
                  >
                    {g.label}
                  </button>
                );
              }

              const isOpen = openDropdown === g.label;
              return (
                <div className="filter-dropdown" key={g.label}>
                  <button
                    className={`filter-pill has-caret ${isActiveGroup ? "active" : ""} ${isOpen ? "open" : ""}`}
                    onClick={() => setOpenDropdown(isOpen ? null : g.label)}
                  >
                    {g.label} <FiChevronDown size={14} />
                  </button>
                  {isOpen && (
                    <div className="filter-dropdown-menu">
                      <button
                        className={`filter-dropdown-item ${activeFilter === g.label ? "active" : ""}`}
                        onClick={() => selectFilter(g.label)}
                      >
                        All {g.label}
                      </button>
                      {g.options.map((o) => (
                        <button
                          key={o.label}
                          className={`filter-dropdown-item ${activeFilter === o.label ? "active" : ""}`}
                          onClick={() => selectFilter(o.label)}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ marginTop: 20, color: "var(--text-muted)" }}>
          Showing <strong>{filtered.length}</strong> products
        </p>

        {filtered.length === 0 ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-muted)" }}>
            <p>No products match your search. Try a different keyword or filter.</p>
            <a
              href={`https://wa.me/${settings?.whatsappNumber || "9779857021032"}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
              style={{ marginTop: 12 }}
            >
              <FiMessageCircle /> Ask us on WhatsApp
            </a>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
