import {createClient} from "@sanity/client"
import {createReadStream, readFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const envPath = resolve(dirname(fileURLToPath(import.meta.url)), ".env")

try {
  readFileSync(envPath, "utf8").split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match && !process.env[match[1].trim()]) process.env[match[1].trim()] = match[2].trim()
  })
} catch {
  // The environment can also be supplied by the shell.
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || "production"
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error("Add SANITY_STUDIO_PROJECT_ID and SANITY_API_TOKEN to studio/.env, then run npm run seed.")
  process.exit(1)
}

const client = createClient({projectId, dataset, token, apiVersion: "2026-10-26", useCdn: false})
const uploaded = new Map()

async function image(file, alt) {
  if (!uploaded.has(file)) {
    const asset = await client.assets.upload("image", createReadStream(resolve(root, "assets", file)), {filename: file})
    uploaded.set(file, asset._id)
  }
  return {_type: "image", asset: {_type: "reference", _ref: uploaded.get(file)}, alt}
}

const photos = {
  car: ["photos/car.jpg", "Bride and groom sharing a kiss as guests toss petals"],
  dress: ["photos/dress.jpg", "Bride and groom in a quiet portrait by the water"],
  rings: ["photos/rings.jpg", "Wedding rings resting on blush roses"],
  aisle: ["photos/aisle.jpg", "Couple watching the sun set over the water"],
  ceremony: ["photos/ceremony.jpg", "Newlyweds celebrating beside the pool"],
  hands: ["photos/hands.jpg", "A bride and groom kissing on a windswept beach"],
  details: ["photos/details.jpg", "Two chairs marked Forever and Always"],
  venue: ["photos/venue.jpg", "A reception table set with flowers in glass vases"],
  sunset: ["photos/sunset.jpg", "A bridal bouquet hanging from a ceremony arch"],
  flatlay: ["photos/flatlay.jpg", "Flowers lining the aisle toward the ceremony"],
  hero: ["hero.png", "Warm wedding scene with the CC monogram"]
}

const assets = {}
for (const [key, value] of Object.entries(photos)) assets[key] = await image(...value)

const reel = [
  ["car", false],
  ["dress", true],
  ["rings", false],
  ["aisle", false],
  ["ceremony", true],
  ["hands", false],
  ["details", false],
  ["venue", false],
  ["sunset", false],
  ["flatlay", false]
].map(([key, monochrome]) => ({
  _type: "object",
  _key: key,
  image: assets[key],
  alt: photos[key][1],
  monochrome
}))

const portfolio = [
  ["car", "Petal kiss", true, true],
  ["dress", "Quiet portrait", true, false],
  ["rings", "Blush roses", true, true],
  ["aisle", "Sunset by the water", true, false],
  ["ceremony", "Pool celebration", true, true],
  ["hands", "Windswept beach", false, false],
  ["details", "Forever and always", false, false],
  ["venue", "Reception table", false, true],
  ["sunset", "Ceremony arch", false, false],
  ["flatlay", "Aisle flowers", false, false]
]

await client.createOrReplace({
  _id: "siteSettings",
  _type: "siteSettings",
  businessName: "Clauds Creates",
  tagline: "Wedding content creation",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/",
  emailLabel: "Email Claude",
  navHome: "Home",
  navAbout: "About",
  navServices: "Services",
  navPortfolio: "Portfolio",
  navKindWords: "Kind Words",
  navEnquire: "Enquire",
  footerLine1: "Clauds Creates",
  footerLine2: "Wedding content creation",
  skipLabel: "Skip to content",
  menuLabel: "Menu",
  seoTitle: "Clauds Creates | Wedding Content Creation",
  seoDescription: "Modern wedding content creation. Candid moments, real emotions, and beautiful photo and video to relive, share and cherish."
})

await client.createOrReplace({
  _id: "homePage",
  _type: "homePage",
  heroEyebrow: "Modern wedding content creation",
  heroTitle: "Your day,",
  heroEmphasis: "as it felt.",
  heroLede: "Candid moments. Real emotions. Beautiful content to relive, share and cherish forever.",
  heroButton: "Enquire about your date",
  heroTags: "Photo · Video · BTS · Social content",
  heroBackground: assets.hero,
  reel,
  highlightsTitle1: "More than",
  highlightsTitle2: "the highlights",
  highlightsIntro: "I create authentic, behind-the-scenes content that captures the real moments of your wedding day — the laughter, the happy tears and everything in between.",
  pillars: [
    {_key: "real", title: "Real moments", text: "Candid, natural content you’ll actually want to watch again and again."},
    {_key: "social", title: "Social ready", text: "Beautifully edited videos and photos, perfect for sharing with friends and family."},
    {_key: "story", title: "Your story", text: "A personal, creative approach to capture your day exactly as it felt."}
  ],
  portfolioEyebrow: "Portfolio",
  portfolioTitle1: "Moments",
  portfolioTitle2: "that matter",
  portfolioLink: "View full portfolio",
  servicesEyebrow: "Services",
  servicesTitle1: "Tailored to",
  servicesTitle2: "your day.",
  servicesBody: "From intimate celebrations to all-day events. I offer flexible packages to suit your plans. Each package includes beautifully edited photo and video content, delivered quickly and ready to share.",
  servicesButton: "View packages",
  servicesImage: assets.ceremony,
  aboutEyebrow: "About me",
  aboutTitle: "Hi, Im Clauds",
  aboutParagraphs: [
    "I’m a wedding content creator with a passion for capturing the real, unfiltered moments. I love the energy, the emotion and the little details that make each day unique. My goal is to create timeless content that lets you relive your wedding exactly as it felt.",
    "I stay close and quiet, then shape the day into photographs and films that feel like the room did. I work with couples who want the real story — the laugh you didn’t know was caught, the look across the table, the song you will play again."
  ],
  aboutPhoto: assets.rings,
  polaroidBack: assets.details,
  polaroidFront: assets.dress,
  scribble1: "Memories",
  scribble2: "that stay",
  scribble3: "forever",
  wordsEyebrow: "Kind words",
  wordsTitle: "What my couples say.",
  wordsLink: "See all",
  enquireBackground: assets.flatlay,
  seoTitle: "Clauds Creates | Wedding Content Creation",
  seoDescription: "Modern wedding content creation. Candid moments, real emotions, and beautiful photo and video to relive, share and cherish."
})

await client.createOrReplace({
  _id: "aboutPage",
  _type: "aboutPage",
  eyebrow: "About me",
  title: "Hi, Im Clauds",
  paragraphs: [
    "I’m a wedding content creator with a passion for capturing the real, unfiltered moments that make your wedding day uniquely yours. From the nervous excitement of the morning preparations to the happy tears, spontaneous laughter and unforgettable moments on the dance floor, I believe the most beautiful memories are often found in the little things you never planned.",
    "For me, wedding content is about more than capturing how your day looked. It’s about preserving how it felt. The butterflies before walking down the aisle, the look you share when you think nobody is watching, the laughter between your favourite people and the fleeting moments that pass in the blink of an eye. These are the memories that deserve to be held onto, revisited and treasured for years to come.",
    "My approach is natural, unobtrusive and deeply personal. I stay close enough to capture the magic as it unfolds, while allowing you to be fully present in every moment. Rather than asking you to pose or recreate a scene, I focus on documenting your day as it genuinely happens, creating photographs and films that feel authentic to you, your relationship and the atmosphere of your celebration.",
    "Whether it’s the quiet intimacy of getting ready, the emotion of your ceremony, the beauty of all the little details or the energy of a packed dance floor, I want you to have something that brings it all rushing back. The voices, the movement, the laughter, the people you love most — the pieces of your story that make your wedding so much more than a single day.",
    "Because long after the flowers have faded and the last song has played, your memories remain. And I want to help you relive them, exactly as they felt."
  ],
  closing: "Your story, your people, your day — beautifully captured, forever remembered.",
  photo: assets.sunset,
  polaroidBack: assets.details,
  polaroidFront: assets.dress,
  scribble1: "Memories",
  scribble2: "that stay",
  scribble3: "forever",
  seoTitle: "About | Clauds Creates",
  seoDescription: "Meet Clauds, a wedding content creator capturing the real, unfiltered moments of the day."
})

await client.createOrReplace({
  _id: "servicesPage",
  _type: "servicesPage",
  eyebrow: "Services",
  title1: "Tailored to",
  title2: "your day.",
  body: "From intimate celebrations to all-day events. I offer flexible packages to suit your plans. Each package includes beautifully edited photo and video content, delivered quickly and ready to share.",
  button: "View packages",
  photo: assets.venue,
  seoTitle: "Services | Clauds Creates",
  seoDescription: "Flexible wedding content packages, from intimate celebrations to full-day coverage."
})

await client.createOrReplace({
  _id: "portfolioPage",
  _type: "portfolioPage",
  eyebrow: "Portfolio",
  title1: "Moments",
  title2: "that matter",
  closeLabel: "Close photo",
  seoTitle: "Portfolio | Clauds Creates",
  seoDescription: "A fuller look at the wedding photographs and films Claude creates."
})

await client.createOrReplace({
  _id: "kindWordsPage",
  _type: "kindWordsPage",
  eyebrow: "Kind words",
  title: "What my couples say.",
  previousLabel: "Previous kind words",
  nextLabel: "Next kind words",
  seoTitle: "Kind Words | Clauds Creates",
  seoDescription: "Notes from couples Claude has worked with."
})

await client.createOrReplace({
  _id: "enquiryPage",
  _type: "enquiryPage",
  eyebrow: "Enquire",
  scriptTitle1: "Let’s capture",
  scriptTitle2: "your day.",
  formTitle1: "I’d love to",
  formTitle2: "hear from you.",
  intro: "I’d love to hear more about your plans. Fill in the form and I’ll get back to you as soon as possible.",
  nameLabel: "Your Name",
  emailLabel: "Email Address",
  dateLabel: "Wedding Date",
  venueLabel: "Venue / Location",
  messageLabel: "Tell me about your day.",
  error: "Please add your name, a valid email, and a few words about your day.",
  submitLabel: "Send enquiry",
  thanksTitle: "Thank you.",
  thanksBody: "Your note is ready. Open it in your email to send it on, or write another if you want to change anything.",
  emailButton: "Email this enquiry",
  anotherLabel: "Write another",
  subject: "Wedding enquiry",
  pagePhoto: assets.hands,
  seoTitle: "Enquire | Clauds Creates",
  seoDescription: "Tell Claude about your wedding day and start a conversation about capturing it."
})

for (const [index, [key, title, featured, showPlay]] of portfolio.entries()) {
  await client.createOrReplace({
    _id: `portfolio-${key}`,
    _type: "portfolioItem",
    title,
    slug: {_type: "slug", current: key},
    description: photos[key][1],
    image: assets[key],
    order: index + 1,
    featured,
    showPlay
  })
}

const packages = [
  ["half", "Half Day Coverage", "Perfect for intimate celebrations.", [
    "Up to six hours, from getting ready to the first dance",
    "Candid photographs through the heart of the day",
    "A short social film, cut for sharing",
    "An edited gallery, ready within three weeks"
  ]],
  ["full", "Full Day Coverage", "From morning preparations to the dance floor.", [
    "Up to ten hours, morning through the last song",
    "A full photo gallery and a ceremony film",
    "Vertical edits sized for stories and reels",
    "Priority delivery, so you can share sooner"
  ]],
  ["bespoke", "Bespoke Packages", "Tailored to your plans and location.", [
    "Coverage shaped around your timeline",
    "Destination and multi-day celebrations welcome",
    "A plan made with you, for the way your day actually runs",
    "Tell me about the wedding and we’ll build it together"
  ]]
]

for (const [index, [key, title, summary, inclusions]] of packages.entries()) {
  await client.createOrReplace({
    _id: `package-${key}`,
    _type: "servicePackage",
    title,
    summary,
    inclusions,
    order: index + 1,
    featured: index === 0
  })
}

const quotes = [
  ["emily", "“The best decision we made!”", "Our content is unreal. So many moments we didn’t even see on the day. We’ve watched the videos over and over again.", "Emily & James", "car"],
  ["sophie", "“So natural and effortless.”", "You blended in perfectly and captured everything so beautifully. The videos are better than we could have imagined.", "Sophie & Tom", "hands"],
  ["hannah", "“It feels like being back there.”", "Quiet parts, loud parts, and everything in between. You kept the day honest, and made something we’ll keep forever.", "Hannah & Luke", "aisle"]
]

for (const [index, [key, headline, quote, names, photo]] of quotes.entries()) {
  await client.createOrReplace({
    _id: `testimonial-${key}`,
    _type: "testimonial",
    headline,
    quote,
    names,
    photo: assets[photo],
    order: index + 1
  })
}

console.log("Existing Clauds Creates content is now in Sanity.")
