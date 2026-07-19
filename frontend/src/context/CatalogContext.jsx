import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as fallback from "../data/fallbackData";
import { categoriesFromGroups, allSelectableLabelsFromGroups } from "../utils/catalogHelpers";

// Where the CMS backend lives. Empty string ("") means "same domain as
// the website" — which is the normal setup, since the backend serves
// both the site and the API from one domain (e.g. rnrfood.com).
// Only set VITE_API_URL if the backend is hosted on a *different*
// domain than the website.
const API_URL = import.meta.env.VITE_API_URL || "";

const FALLBACK_DATA = {
  products: fallback.PRODUCTS,
  categoryGroups: fallback.CATEGORY_GROUPS,
  varieties: fallback.VARIETIES,
  team: fallback.TEAM,
  testimonials: fallback.TESTIMONIALS,
  settings: {
    siteName: "R&R Food Products",
    contactEmail: "Support@riyarakshya.com.np",
    contactPhone: "+977 982-0299711",
    whatsappNumber: "9779857021032",
    address: "S.No.-4, SugarMill area, Bhairahawa, Nepal",
  },
  pages: {},
};

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  // Start with the fallback data so the site renders instantly and
  // never shows an empty page — it's swapped for live CMS data the
  // moment the fetch succeeds.
  const [data, setData] = useState(FALLBACK_DATA);
  const [status, setStatus] = useState("loading"); // "loading" | "live" | "fallback"

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/catalog`)
      .then((res) => {
        if (!res.ok) throw new Error(`CMS responded with ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setData({
          products: json.products?.length ? json.products : fallback.PRODUCTS,
          categoryGroups: json.categoryGroups?.length ? json.categoryGroups : fallback.CATEGORY_GROUPS,
          varieties: json.varieties?.length ? json.varieties : fallback.VARIETIES,
          team: json.team?.length ? json.team : fallback.TEAM,
          testimonials: json.testimonials?.length ? json.testimonials : fallback.TESTIMONIALS,
          settings: json.settings || FALLBACK_DATA.settings,
          pages: json.pages || {},
        });
        setStatus("live");
      })
      .catch(() => {
        // CMS unreachable (not deployed yet, offline, etc). The site
        // keeps working fine on the bundled fallback data.
        if (!cancelled) setStatus("fallback");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => categoriesFromGroups(data.categoryGroups), [data.categoryGroups]);
  const allSelectableLabels = useMemo(
    () => allSelectableLabelsFromGroups(data.categoryGroups),
    [data.categoryGroups]
  );

  const value = useMemo(
    () => ({ ...data, categories, allSelectableLabels, status }),
    [data, categories, allSelectableLabels, status]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog() must be used inside <CatalogProvider>");
  return ctx;
}
