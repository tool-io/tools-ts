import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const cloneAreaNoteGeneratorExample = {
  input: { areaHectares: 2.5 },
  output: { genetAreaNote: "Genet covers approximately 2.5 ha." },
} satisfies ToolExample<
  { readonly areaHectares: number },
  { readonly genetAreaNote: string }
>;

export const cloneAreaNoteGeneratorTool = createSimpleTool({
  id: "mycology/clone-area-hectares-note-generator",
  title: "Clone Area Note",
  description:
    "Generate a field note stating the area covered by a fungal genet in hectares.",
  inputs: [
    {
      id: "areaHectares",
      kind: "number",
      label: "Area",
      minimum: Number.MIN_VALUE,
      unit: "ha",
    },
  ],
  outputs: [{ id: "genetAreaNote", kind: "string", label: "Genet area note" }],
  calculate: (input) => ({
    genetAreaNote: `Genet covers approximately ${String(input.areaHectares)} ha.`,
  }),
});
export const runCloneAreaNoteGenerator = cloneAreaNoteGeneratorTool.execute;
export default cloneAreaNoteGeneratorTool;
