// ─────────────────────────────────────────────────────────────
//  Pure helper functions for working with catalog data. These
//  don't care whether the data came from the CMS API or the
//  built-in fallback — they just take a list/product and return
//  an answer, so the whole app behaves identically either way.
// ─────────────────────────────────────────────────────────────

// Flat list of every group label (used for things like the footer's
// category links).
export function categoriesFromGroups(groups) {
  return (groups || []).map((g) => g.label);
}

// Every label a person could land on via a URL — group labels plus
// each dropdown sub-option's label — used to validate `?category=`.
export function allSelectableLabelsFromGroups(groups) {
  return (groups || []).flatMap((g) =>
    g.options?.length ? [g.label, ...g.options.map((o) => o.label)] : [g.label]
  );
}

export function categoryMatches(productCategory, selected, groups) {
  if (!selected || selected === "All Products") return true;
  if (productCategory === selected) return true;
  const group = (groups || []).find((g) => g.label === selected);
  if (group?.options) {
    return group.options.some((o) => o.label === productCategory);
  }
  return false;
}

export function getProductById(products, id) {
  return (products || []).find((p) => String(p.id) === String(id));
}

export function priceForSize(product, size) {
  if (!product) return null;
  const match = product.sizeOptions?.find((s) => s.size === size);
  if (match) return match.price;
  return product.price;
}

export function defaultSize(product) {
  return product?.sizes?.[0] || product?.unit;
}

export function isAvailable(product) {
  return typeof product?.price === "number";
}
