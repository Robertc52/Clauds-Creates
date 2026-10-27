import {defineArrayMember, defineField, defineType} from "sanity"

const imageField = (name, title, description, group) =>
  defineField({
    name,
    title,
    description,
    group,
    type: "image",
    options: {hotspot: true},
    fields: [
      defineField({
        name: "alt",
        title: "Description",
        type: "string",
        description: "A short description of the photograph, for accessibility."
      })
    ]
  })

const seoFields = [
  defineField({name: "seoTitle", title: "Page title", type: "string", description: "Shown in the browser tab and search results."}),
  defineField({name: "seoDescription", title: "Page description", type: "text", rows: 3, description: "A short summary for search results and link previews."})
]

export const singletonTypes = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "servicesPage",
  "portfolioPage",
  "kindWordsPage",
  "enquiryPage"
]

const siteSettings = defineType({
  name: "siteSettings",
  title: "Website settings",
  type: "document",
  fields: [
    defineField({name: "businessName", title: "Business name", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "tagline", title: "Tagline", type: "string"}),
    defineField({name: "contactEmail", title: "Contact email", type: "string", description: "Used when an enquiry is opened in email. Leave blank if you do not want a recipient filled in."}),
    defineField({name: "phone", title: "Telephone", type: "string", description: "Optional. Only shown if you fill it in."}),
    defineField({name: "instagram", title: "Instagram URL", type: "url"}),
    defineField({name: "tiktok", title: "TikTok URL", type: "url"}),
    defineField({name: "emailLabel", title: "Email icon label", type: "string"}),
    defineField({name: "navHome", title: "Home menu label", type: "string"}),
    defineField({name: "navAbout", title: "About menu label", type: "string"}),
    defineField({name: "navServices", title: "Services menu label", type: "string"}),
    defineField({name: "navPortfolio", title: "Portfolio menu label", type: "string"}),
    defineField({name: "navKindWords", title: "Kind words menu label", type: "string"}),
    defineField({name: "navEnquire", title: "Enquire menu label", type: "string"}),
    defineField({name: "footerLine1", title: "Footer line one", type: "string"}),
    defineField({name: "footerLine2", title: "Footer line two", type: "string"}),
    defineField({name: "skipLabel", title: "Skip link label", type: "string"}),
    defineField({name: "menuLabel", title: "Mobile menu label", type: "string"}),
    imageField("shareImage", "Social sharing image", "Used when the site is shared, if a page does not have its own."),
    ...seoFields
  ]
})

const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [
    {name: "hero", title: "Hero"},
    {name: "highlights", title: "Highlights"},
    {name: "portfolio", title: "Portfolio preview"},
    {name: "services", title: "Services preview"},
    {name: "about", title: "About preview"},
    {name: "words", title: "Kind words"},
    {name: "seo", title: "SEO"}
  ],
  fields: [
    defineField({name: "heroEyebrow", title: "Small line above the headline", type: "string", group: "hero"}),
    defineField({name: "heroTitle", title: "Headline", type: "string", group: "hero", description: "The first line, before the italic line."}),
    defineField({name: "heroEmphasis", title: "Italic headline", type: "string", group: "hero"}),
    defineField({name: "heroLede", title: "Supporting text", type: "text", rows: 3, group: "hero"}),
    defineField({name: "heroButton", title: "Button label", type: "string", group: "hero"}),
    defineField({name: "heroTags", title: "Line under the button", type: "string", group: "hero", description: "Separate items with a middle dot, for example Photo · Video · BTS."}),
    imageField("heroBackground", "Hero background", "The wide photograph behind the headline. Leave empty to keep the current one.", "hero"),
    defineField({
      name: "reel",
      title: "Photo reel",
      description: "Not used on the site. The homepage reel is filled with the 10 portfolio photographs added most recently.",
      type: "array",
      group: "hero",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({name: "image", title: "Photograph", type: "image", options: {hotspot: true}, validation: (rule) => rule.required()}),
            defineField({name: "alt", title: "Description", type: "string"}),
            defineField({name: "monochrome", title: "Show in black and white", type: "boolean", initialValue: false})
          ],
          preview: {select: {title: "alt", media: "image"}}
        })
      ]
    }),
    defineField({name: "highlightsTitle1", title: "Highlights heading, line one", type: "string", group: "highlights"}),
    defineField({name: "highlightsTitle2", title: "Highlights heading, line two", type: "string", group: "highlights"}),
    defineField({name: "highlightsIntro", title: "Highlights introduction", type: "text", rows: 3, group: "highlights"}),
    defineField({
      name: "pillars",
      title: "Highlight points",
      type: "array",
      group: "highlights",
      of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({name: "title", title: "Title", type: "string", validation: (rule) => rule.required()}),
          defineField({name: "text", title: "Text", type: "text", rows: 3})
        ]
      })]
    }),
    defineField({name: "portfolioEyebrow", title: "Portfolio small heading", type: "string", group: "portfolio"}),
    defineField({name: "portfolioTitle1", title: "Portfolio heading, line one", type: "string", group: "portfolio"}),
    defineField({name: "portfolioTitle2", title: "Portfolio heading, line two", type: "string", group: "portfolio"}),
    defineField({name: "portfolioLink", title: "Portfolio link label", type: "string", group: "portfolio"}),
    defineField({name: "servicesEyebrow", title: "Services small heading", type: "string", group: "services"}),
    defineField({name: "servicesTitle1", title: "Services heading, line one", type: "string", group: "services"}),
    defineField({name: "servicesTitle2", title: "Services heading, line two", type: "string", group: "services"}),
    defineField({name: "servicesBody", title: "Services text", type: "text", rows: 4, group: "services"}),
    defineField({name: "servicesButton", title: "Services button", type: "string", group: "services"}),
    imageField("servicesImage", "Services photograph", "The photograph beside Tailored to your day on the home page.", "services"),
    defineField({name: "aboutEyebrow", title: "About small heading", type: "string", group: "about"}),
    defineField({name: "aboutTitle", title: "About heading", type: "string", group: "about"}),
    defineField({name: "aboutParagraphs", title: "About paragraphs", type: "array", group: "about", of: [defineArrayMember({type: "text"})]}),
    imageField("aboutPhoto", "About photograph", "The large photograph beside the home about text.", "about"),
    imageField("polaroidBack", "Back polaroid", "The smaller photograph behind the front polaroid.", "about"),
    imageField("polaroidFront", "Front polaroid", "The tilted photograph in front.", "about"),
    defineField({name: "scribble1", title: "Handwritten line one", type: "string", group: "about"}),
    defineField({name: "scribble2", title: "Handwritten line two", type: "string", group: "about"}),
    defineField({name: "scribble3", title: "Handwritten line three", type: "string", group: "about"}),
    defineField({name: "wordsEyebrow", title: "Kind words small heading", type: "string", group: "words"}),
    defineField({name: "wordsTitle", title: "Kind words heading", type: "string", group: "words"}),
    defineField({name: "wordsLink", title: "See all label", type: "string", group: "words"}),
    imageField("enquireBackground", "Enquire photograph", "The photograph behind Let's capture your day on the home page.", "seo"),
    ...seoFields.map((field) => ({...field, group: "seo"}))
  ]
})

const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({name: "eyebrow", title: "Small heading", type: "string"}),
    defineField({name: "title", title: "Heading", type: "string"}),
    defineField({name: "paragraphs", title: "Paragraphs", type: "array", of: [defineArrayMember({type: "text"})]}),
    defineField({name: "closing", title: "Closing line", type: "text", rows: 3}),
    imageField("photo", "Main photograph", "The large photograph on the About page."),
    imageField("polaroidBack", "Back polaroid", ""),
    imageField("polaroidFront", "Front polaroid", ""),
    defineField({name: "scribble1", title: "Handwritten line one", type: "string"}),
    defineField({name: "scribble2", title: "Handwritten line two", type: "string"}),
    defineField({name: "scribble3", title: "Handwritten line three", type: "string"}),
    ...seoFields
  ]
})

const servicesPage = defineType({
  name: "servicesPage",
  title: "Services page",
  type: "document",
  fields: [
    defineField({name: "eyebrow", title: "Small heading", type: "string"}),
    defineField({name: "title1", title: "Heading, line one", type: "string"}),
    defineField({name: "title2", title: "Heading, line two", type: "string"}),
    defineField({name: "body", title: "Introduction", type: "text", rows: 4}),
    defineField({name: "button", title: "Button label", type: "string"}),
    imageField("photo", "Photograph", "The photograph on the Services page. This can be different from the home page."),
    ...seoFields
  ]
})

const portfolioPage = defineType({
  name: "portfolioPage",
  title: "Portfolio page",
  type: "document",
  fields: [
    defineField({name: "eyebrow", title: "Small heading", type: "string"}),
    defineField({name: "title1", title: "Heading, line one", type: "string"}),
    defineField({name: "title2", title: "Heading, line two", type: "string"}),
    defineField({name: "closeLabel", title: "Close photo label", type: "string"}),
    ...seoFields
  ]
})

const kindWordsPage = defineType({
  name: "kindWordsPage",
  title: "Kind words page",
  type: "document",
  fields: [
    defineField({name: "eyebrow", title: "Small heading", type: "string"}),
    defineField({name: "title", title: "Heading", type: "string"}),
    defineField({name: "previousLabel", title: "Previous button label", type: "string"}),
    defineField({name: "nextLabel", title: "Next button label", type: "string"}),
    ...seoFields
  ]
})

const enquiryPage = defineType({
  name: "enquiryPage",
  title: "Enquiry page",
  type: "document",
  fields: [
    defineField({name: "eyebrow", title: "Small heading", type: "string"}),
    defineField({name: "scriptTitle1", title: "Script heading, line one", type: "string"}),
    defineField({name: "scriptTitle2", title: "Script heading, line two", type: "string"}),
    defineField({name: "formTitle1", title: "Form heading, line one", type: "string"}),
    defineField({name: "formTitle2", title: "Form heading, line two", type: "string"}),
    defineField({name: "intro", title: "Introduction", type: "text", rows: 3}),
    defineField({name: "nameLabel", title: "Name label", type: "string"}),
    defineField({name: "emailLabel", title: "Email label", type: "string"}),
    defineField({name: "dateLabel", title: "Date label", type: "string"}),
    defineField({name: "venueLabel", title: "Venue label", type: "string"}),
    defineField({name: "messageLabel", title: "Message label", type: "string"}),
    defineField({name: "error", title: "Error message", type: "text", rows: 2}),
    defineField({name: "submitLabel", title: "Send button", type: "string"}),
    defineField({name: "thanksTitle", title: "Thank you heading", type: "string"}),
    defineField({name: "thanksBody", title: "Thank you text", type: "text", rows: 3}),
    defineField({name: "emailButton", title: "Email button", type: "string"}),
    defineField({name: "anotherLabel", title: "Write another label", type: "string"}),
    defineField({name: "subject", title: "Email subject", type: "string", description: "The start of the email subject. The couple's name is added after it."}),
    imageField("pagePhoto", "Enquire page photograph", "Shown only on the Enquire page."),
    ...seoFields
  ]
})

const portfolioItem = defineType({
  name: "portfolioItem",
  title: "Portfolio photograph",
  type: "document",
  fields: [
    defineField({name: "title", title: "Title", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "slug", title: "Slug", type: "slug", options: {source: "title"}}),
    defineField({name: "description", title: "Description", type: "text", rows: 3}),
    imageField("image", "Photograph", "The image shown in the portfolio."),
    defineField({name: "order", title: "Order", type: "number", description: "Lower numbers appear first on the portfolio page. The homepage uses the date a photograph was added.", initialValue: 0}),
    defineField({name: "featured", title: "Show on the homepage", type: "boolean", description: "Not used. The homepage reel uses the 10 newest photographs, and Moments that matter uses the next 5.", initialValue: false}),
    defineField({name: "showPlay", title: "Show the play mark", type: "boolean", initialValue: false})
  ],
  orderings: [{title: "Display order", name: "orderAsc", by: [{field: "order", direction: "asc"}]}],
  preview: {select: {title: "title", media: "image"}}
})

const servicePackage = defineType({
  name: "servicePackage",
  title: "Package",
  type: "document",
  fields: [
    defineField({name: "title", title: "Name", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "summary", title: "Short description", type: "string"}),
    defineField({name: "price", title: "Price", type: "string", description: "Optional. Leave blank to hide a price. Nothing is shown unless you type one."}),
    defineField({name: "inclusions", title: "Included", type: "array", of: [defineArrayMember({type: "string"})]}),
    defineField({name: "note", title: "Note", type: "text", rows: 2}),
    defineField({name: "order", title: "Order", type: "number", initialValue: 0}),
    defineField({name: "featured", title: "Featured", type: "boolean", initialValue: false})
  ],
  orderings: [{title: "Display order", name: "orderAsc", by: [{field: "order", direction: "asc"}]}],
  preview: {select: {title: "title", subtitle: "summary"}}
})

const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({name: "headline", title: "Short quote", type: "string", validation: (rule) => rule.required()}),
    defineField({name: "quote", title: "Full words", type: "text", rows: 4, validation: (rule) => rule.required()}),
    defineField({name: "names", title: "Names", type: "string"}),
    defineField({name: "date", title: "Wedding date", type: "string", description: "Optional. Only shown if you fill it in."}),
    imageField("photo", "Photograph", "Optional photograph beside the quote."),
    defineField({name: "order", title: "Order", type: "number", description: "Not used. The newest testimonials appear first. The homepage shows 10 of them.", initialValue: 0})
  ],
  orderings: [{title: "Display order", name: "orderAsc", by: [{field: "order", direction: "asc"}]}],
  preview: {select: {title: "names", subtitle: "headline", media: "photo"}}
})

export const schemaTypes = [
  siteSettings,
  homePage,
  aboutPage,
  servicesPage,
  portfolioPage,
  kindWordsPage,
  enquiryPage,
  portfolioItem,
  servicePackage,
  testimonial
]
