// Seeds the page content into data/db.json so the CMS can manage it.
// Safe to re-run: only adds pages that don't exist yet, unless --force.
import { readDb, writeDb } from "./db.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data", "db.json");
const force = process.argv.includes("--force");

const PAGE_CONTENT = {
  home: {
    hero: {
      badge: "\u0928\u0947\u092a\u093e\u0932\u0915\u094b \u0938\u094d\u0935\u093e\u0926",
      heading: "One Bite & You Won't Stop",
      headingHighlight: "Craving",
      subtitle: "Instant noodles, crunchy snacks, and bulk packs delivered straight to your door. Freshness guaranteed in every bite.",
      cta1Text: "Shop Now",
      cta1Link: "/products",
      cta2Text: "Become a Distributor",
      cta2Link: "/contact",
      stats: [
        { value: "500+", label: "Happy Retailers" },
        { value: "10+", label: "Product Lines" },
        { value: "77", label: "Districts" },
      ],
      slides: [
        "/images/hero/hero-bg.png",
        "/images/hero/home hero kushal namkeen.png",
        "/images/hero/home hero makai and diet.png",
        "/images/hero/home hero cheese balls.png",
        "/images/hero/home hero aone chips green.png",
      ],
    },
    newArrivals: {
      tag: "NEW ARRIVALS",
      heading: "Fresh From Our Kitchen",
    },
    story: {
      tag: "HEALTHY LIVING",
      heading: "Nepal's Most Trusted Snack Brand",
      body: [
        "With over a decade of experience, Riya & Rakshya Food Products has grown from a small kitchen in Bhairahawa to one of Nepal's leading snack manufacturers. Our commitment to quality, taste, and innovation has earned the trust of thousands of customers across all 77 districts.",
        "Every product is crafted using the finest ingredients, prepared in a hygienic facility, and tested to meet the highest quality standards before reaching your hands.",
      ],
      image: "/images/home page below new arrivals.png",
      features: [
        { title: "100% Vegetarian", desc: "Pure vegetarian snacks" },
        { title: "Premium Quality", desc: "Best raw materials" },
        { title: "Fast Delivery", desc: "Quick nationwide shipping" },
        { title: "Trusted Brand", desc: "Loved by thousands" },
      ],
      ctaText: "Learn more about us",
    },
    featuredProducts: {
      tag: "FEATURED PRODUCTS",
      heading: "Our Top Picks For You",
      ctaText: "View All Products",
    },
    perks: [
      { title: "10+", desc: "Years Of Experience" },
      { title: "Modern", desc: "Manufacturing Unit" },
      { title: "Best Quality", desc: "Raw Materials" },
      { title: "Happy", desc: "Customers" },
      { title: "Wide", desc: "Distribution Network" },
    ],
    aboutStory: {
      tag: "ABOUT US",
      heading: "The R&R Story",
      body: [
        "We started with one goal: make snacks that are fast, tasty, and satisfying. From our kitchen to your table, every bite is crafted with care, using quality ingredients and attention to detail. We believe that great taste comes from consistency and passion in every step of the process.",
        "In a small kitchen in Bhairahawa, two passionate food lovers began experimenting with traditional recipes, blending age-old flavors with modern convenience. What started as a family passion quickly grew into something bigger.",
        "Today, Riya and Rakshya Food Products manufactures over 60 varieties of instant noodles, namkeen, dalmot, chips and bhujiya \u2014 loved by thousands across Nepal.",
      ],
      image: "/images/abouthome.png",
      ctaText: "Learn more about us",
    },
    ctaBanner: {
      heading: "Ready to stock up on Nepal's favorite snacks?",
      body: "Whether you're treating yourself or stocking your store, ordering is just a message away. Fast delivery guaranteed.",
      button1Text: "View Full Menu",
      button1Link: "/products",
      button2Text: "Chat on WhatsApp",
    },
    testimonials: {
      tag: "CUSTOMER'S LOVE",
      heading: "Loved By Our Customers",
    },
    howWeMakeIt: {
      tag: "HOW WE MAKE IT",
      heading: "Crafted With Care, Delivered With Trust",
      body: [
        "Every packet of Riya & Rakshya snacks goes through a carefully managed process \u2014 from selecting the finest ingredients to precision mixing, cooking, and packaging. Our modern facility in Bhairahawa ensures hygiene and consistency at every step.",
        "We combine traditional Nepali recipes with advanced manufacturing technology to deliver snacks that taste authentic yet meet the highest quality standards. Watch how we bring your favourite snacks to life.",
      ],
      video: "/videos/RnR video.mp4",
      ctaText: "See How It's Made",
    },
  },

  about: {
    hero: {
      breadcrumb: "HOME > ABOUT",
      title: "About Riya & Rakshya Food Products",
      subtitle: "From a small kitchen dream to Nepal's beloved snack brand \u2014 here's our story.",
      bgImage: "/images/aboutherosection.png",
    },
    story: {
      tag: "ABOUT US",
      heading: "The R&R Story",
      body: [
        "We started with one goal: make snacks that are fast, tasty, and satisfying. From our kitchen to your table, every bite is crafted with care, using quality ingredients and attention to detail. We believe that great taste comes from consistency and passion in every step of the process.",
        "In a small kitchen in Bhairahawa, two passionate food lovers began experimenting with traditional recipes, blending age-old flavors with modern convenience. What started as a family passion quickly grew into something bigger.",
        "Today, Riya and Rakshya Food Products manufactures over 60 varieties of instant noodles, namkeen, dalmot, chips and bhujiya \u2014 loved by thousands across Nepal.",
      ],
      image: "/images/abouthome.png",
    },
    missionVision: {
      tag: "WHAT DRIVES US",
      heading: "The Core Purpose And Future Aspirations Of Our Company",
      mission: {
        number: "01",
        title: "Our Mission",
        body: "To become Nepal's most trusted and loved snack brand by delivering high-quality, innovative, and delicious products that create happiness and memorable moments for every customer. We are committed to using the finest ingredients, maintaining the highest standards of hygiene, and continuously innovating to bring flavors that delight every Nepali household. With passion and dedication, we aim to grow alongside our customers, sharing joy in every bite and building lasting relationships rooted in trust and quality.",
        tags: ["Tasty", "Convenient", "Affordable"],
      },
      vision: {
        number: "02",
        title: "Our Vision",
        body: "To inspire healthier snacking habits across Nepal through innovative, affordable, and tasty products that bring families together and celebrate the joy of sharing. We envision a future where every Nepali can enjoy nutritious and delicious snacks made with love, care, and a deep respect for tradition.",
        tags: ["Innovative", "Loved", "Trusted"],
      },
    },
    quality: {
      tag: "QUALITY FIRST",
      heading: "Our Commitment To Quality & Safety",
      body: [
        "At Riya & Rakshya, quality isn't just a promise \u2014 it's our foundation. Every product undergoes rigorous testing at multiple stages of production, from raw material inspection to final packaging, ensuring consistency in taste, texture, and safety.",
        "Our manufacturing facility follows strict hygiene protocols, with regular audits and compliance checks. We use only premium-grade ingredients sourced from trusted suppliers, and our production lines are equipped with modern machinery that maintains precise quality standards.",
        "From the moment raw materials arrive at our facility to the final seal on every pack, we leave nothing to chance. Our dedicated quality team monitors each batch, conducting taste tests, texture analysis, and safety evaluations \u2014 so you can enjoy every bite with complete confidence.",
      ],
      video: "/videos/RnR video.mp4",
      tags: ["FSSAI Compliant", "ISO Standards", "Quality Tested", "No Preservatives"],
    },
    scale: {
      tag: "OUR SCALE",
      heading: "Manufacturing At Scale",
      stats: [
        { value: "50+", label: "Products Manufactured" },
        { value: "77", label: "Districts Covered" },
        { value: "500+", label: "Retail Partners" },
        { value: "10K+", label: "Daily Production (Kg)" },
      ],
    },
    advantages: {
      tag: "OUR ADVANTAGES",
      heading: "Why Choose Riya & Rakshya?",
      items: [
        { title: "Delicious Taste", desc: "Authentic Nepali flavors that keep you coming back" },
        { title: "Multiple Size", desc: "From 12g to 1kg \u2014 a size for every need" },
        { title: "Affordable Pricing", desc: "Premium quality snacks at prices everyone can enjoy" },
        { title: "Trusted Quality", desc: "Rigorous testing ensures every pack is perfect" },
        { title: "Consistent Experience", desc: "Same great taste in every single pack" },
      ],
    },
    peopleBehindUs: {
      tag: "PEOPLE BEHIND US",
      heading: "Meet The People Behind R&R",
      body: [
        "Behind every pack of Riya & Rakshya snacks is a team of dedicated people who pour their heart into making sure every snack reaches your table with freshness, quality and love. From recipe development to packaging, our people are the strength of this brand.",
        "Our passionate workforce combines traditional craftsmanship with modern food science to create snacks that millions enjoy every day across Nepal.",
      ],
      video: "/videos/the people behind us.mp4",
    },
    cta: {
      heading: "Ready to explore our snacks?",
      body: "Browse our wide collection of freshly crafted snacks, made with quality ingredients and authentic recipes.",
      buttonText: "Explore Menu",
      bulkHeading: "Interested in Bulk Orders or Distribution?",
      bulkBody: "We're always looking for retail partners and distributors across Nepal. Get factory-direct pricing and dedicated support.",
      bulkButton1: "Explore Manufacturing",
      bulkButton2: "Contact Sales team",
    },
  },

  contact: {
    hero: {
      breadcrumb: "HOME > CONTACT",
      title: "Let's Get in Touch",
      subtitle: "Got a question about your favorite snack? Want to become a distributor? We'd love to hear from you.",
      bgImage: "/images/contactherosection.png",
    },
    contactInfo: {
      heading: "Get in Touch",
      items: [
        { label: "Customer Support", value: "+977 982-0299711" },
        { label: "Business/Wholesale", value: "+977 985-7021032" },
        { label: "Support Email", value: "Support@riyarakshya.com.np" },
        { label: "Sales/Distributors", value: "Sales@riyarakshya.com.np" },
        { label: "Address", value: "S.N.P-04, SugarMill Area, Bhairahawa Rupandehi" },
        { label: "Business Hours", value: "Sunday\u2013Friday (9:00 AM \u2013 6:00 PM)" },
      ],
    },
    whatsappHelp: {
      heading: "Need Quick Help?",
      body: "Message us directly on WhatsApp for immediate assistance.",
    },
    form: {
      heading: "Send us a Message",
      body: "Fill out the form below and we'll get back to you as soon as possible.",
      successMessage: "Thanks! Your message has been sent \u2014 we'll be in touch shortly.",
      fields: {
        nameLabel: "Name",
        emailLabel: "Email",
        phoneLabel: "Phone",
        inquiryLabel: "Inquiry Type",
        messageLabel: "Message",
        submitText: "Send Message",
      },
      inquiryOptions: [
        { value: "general", label: "General Question" },
        { value: "distributor", label: "Become a Distributor" },
        { value: "bulk", label: "Bulk Order" },
        { value: "complaint", label: "Product Issue" },
      ],
    },
    quickHelp: {
      tag: "SUPPORT CENTRE",
      heading: "Quick Help & Answers",
      items: [
        { title: "Report a Product Issue", desc: "Noticed a quality concern? Let us know immediately" },
        { title: "Ingredient & Allergy Info", desc: "Check packaging for detailed allergen information" },
        { title: "Storage Instructions", desc: "Store in a cool, dry place away from direct sunlight" },
        { title: "Expiry & Batch Details", desc: "Find batch numbers and expiry dates on the back of the pack" },
      ],
    },
    cta: {
      heading: "Ready to explore our snacks?",
      body: "Browse our wide collection of freshly crafted snacks, made with quality ingredients and authentic recipes.",
      buttonText: "Explore Menu",
      bulkHeading: "Interested in Bulk Orders or Distribution?",
      bulkBody: "We're always looking for retail partners and distributors across Nepal.",
      bulkButton1: "Learn more about us",
      bulkButton2: "Contact Sales team",
    },
    faq: {
      tag: "FREQUENTLY ASKED QUESTIONS",
      heading: "Quick Help & Answers",
      items: [
        { q: "Where is Riya & Rakshya Food Products located?", a: "Our manufacturing facility is located in Bhairahawa, Nepal. We operate from S.N.P-04, SugarMill Area and serve customers across all 77 districts of Nepal." },
        { q: "Are your snacks vegetarian?", a: "Yes, all our snacks are 100% vegetarian and prepared in a dedicated vegetarian facility." },
        { q: "How can I become a distributor?", a: "Please reach out via our contact form or call our business line. We will guide you through the distributor onboarding process with competitive pricing and dedicated support." },
        { q: "Do you offer bulk order discounts?", a: "Yes, we offer factory-direct pricing for bulk orders and have dedicated support for retailers and distributors. Contact our sales team for custom quotes based on your order volume." },
        { q: "How can I contact customer support?", a: "You can reach us at +977 982-0299711 for customer support, email us at Support@riyarakshya.com.np, or chat with us on WhatsApp. We are available Sunday-Friday, 9:00 AM to 6:00 PM." },
      ],
    },
  },

  manufacturing: {
    hero: {
      breadcrumb: "HOME > MANUFACTURING",
      title: "Our Manufacturing Process",
      subtitle: "State-of-the-art production facilities crafting authentic Nepali snacks with precision and care.",
      bgImage: "/images/manufacturinghero.png",
    },
    processSteps: {
      tag: "HOW IT'S MADE",
      heading: "From Raw Ingredients to Your Favourite Snack",
      intro: "Every packet of Riya & Rakshya snacks goes through a carefully managed 6-step process \u2014 from selecting the finest ingredients to the final quality check before dispatch.",
      steps: [
        { title: "Quality Ingredients", desc: "Premium flour, spices, and seasonings sourced from trusted suppliers across Nepal." },
        { title: "Quality Testing", desc: "Rigorous in-lab testing to ensure purity and safety of every batch." },
        { title: "Precision Mixing", desc: "Traditional recipes combined with modern precision for consistent taste." },
        { title: "Cooking & Processing", desc: "Automated frying, roasting, and seasoning for authentic crunch and flavour." },
        { title: "Final Quality Check", desc: "Every product passes taste, texture, and packaging inspection before dispatch." },
        { title: "Packaging", desc: "Food-grade materials lock in freshness and crunch in a hygienic facility." },
      ],
    },
    facility: {
      tag: "INSIDE OUR FACILITY",
      heading: "Built for Quality, Designed for Scale",
      body: "Our modern manufacturing unit in Bhairahawa combines traditional Nepali recipes with advanced technology to deliver snacks that taste authentic and meet the highest quality standards.",
      image: "/images/manufacturingquality.png",
      features: [
        { title: "Modern Plant", desc: "Automated production lines for maximum efficiency" },
        { title: "In-House Lab", desc: "Quality control at every stage of production" },
        { title: "Large Capacity", desc: "Bulk orders fulfilled across all 77 districts" },
        { title: "FSSAI Certified", desc: "Meets all national food safety standards" },
      ],
    },
    cta: {
      heading: "Interested in Bulk Orders?",
      body: "We offer competitive pricing for retailers and distributors across Nepal.",
      button1Text: "Become a Distributor",
      button2Text: "Chat on WhatsApp",
      badges: ["Nationwide Delivery", "FSSAI Certified", "Consistent Quality"],
    },
    capabilities: {
      tag: "OUR CAPABILITIES",
      heading: "Why Our Manufacturing Stands Out",
      items: [
        { title: "Modern Facility", desc: "Our state-of-the-art manufacturing plant in Bhairahawa is equipped with automated production lines for maximum efficiency." },
        { title: "In-House Lab", desc: "A fully equipped quality control laboratory monitors every stage of production to maintain the highest standards." },
        { title: "Large Capacity", desc: "With expanded production capacity, we efficiently fulfil bulk orders for retailers and distributors across all 77 districts." },
        { title: "FSSAI Certified", desc: "Our facility meets all national food safety standards, ensuring every product is safe, hygienic, and trustworthy." },
      ],
    },
  },

  products: {
    hero: {
      breadcrumb: "HOME > PRODUCTS",
      title: "Our Product Collection",
      subtitle: "Discover our complete range of authentic, premium snacks crafted for the perfect crunch.",
      bgImage: "/images/productswishlisthero.png",
    },
  },

  shared: {
    footer: {
      tagline: "Bringing the authentic taste of Nepal to your home with our premium quality snacks, tasty noodles and namkeen.",
      socialFacebook: "https://facebook.com",
      socialInstagram: "https://instagram.com",
      socialTwitter: "https://twitter.com",
      copyright: "\u00a9 2026 Riya & Rakshya Food Products. All rights reserved.",
      subscribeHeading: "Subscribe",
      subscribeDescription: "Subscribe to get the latest snack drops, offers and distributor news straight to your inbox.",
    },
    navbar: {
      whatsappText: "WhatsApp",
    },
  },
};

const db = readDb();
if (!db.pages) db.pages = {};

let added = 0;
for (const [key, content] of Object.entries(PAGE_CONTENT)) {
  if (!db.pages[key] || force) {
    db.pages[key] = content;
    added++;
  }
}

await writeDb(db);
console.log(`Seeded ${added} page(s) content into db.json.`);
console.log("Pages:", Object.keys(PAGE_CONTENT).join(", "));
