const SINGLETONS = [
  ["siteSettings", "Website settings"],
  ["homePage", "Homepage"],
  ["aboutPage", "About page"],
  ["servicesPage", "Services page"],
  ["portfolioPage", "Portfolio page"],
  ["kindWordsPage", "Kind words page"],
  ["enquiryPage", "Enquiry page"]
]

export const structure = (S) =>
  S.list()
    .title("Clauds Creates")
    .items([
      ...SINGLETONS.map(([type, title]) =>
        S.listItem()
          .title(title)
          .id(type)
          .child(S.document().schemaType(type).documentId(type).title(title))
      ),
      S.divider(),
      S.documentTypeListItem("portfolioItem").title("Portfolio"),
      S.documentTypeListItem("servicePackage").title("Packages"),
      S.documentTypeListItem("testimonial").title("Testimonials")
    ])
