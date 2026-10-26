import {defineConfig} from "sanity"
import {structureTool} from "sanity/structure"
import {visionTool} from "@sanity/vision"
import {schemaTypes, singletonTypes} from "./schemaTypes"
import {structure} from "./structure"

export default defineConfig({
  name: "clauds-creates",
  title: "Clauds Creates",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "projectid",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool({structure}), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => !singletonTypes.includes(template.schemaType))
  },
  document: {
    actions: (input, context) =>
      singletonTypes.includes(context.schemaType)
        ? input.filter(({action}) => action !== "duplicate" && action !== "delete")
        : input
  }
})
