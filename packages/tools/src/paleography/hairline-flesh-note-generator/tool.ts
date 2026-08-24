import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HairlineFleshNoteGeneratorInput = {
  readonly firstPageSide?: "hair" | "flesh";
};

export type HairlineFleshNoteGeneratorOutput = {
  readonly rectoSkinSide: "hair" | "flesh";
  readonly versoSkinSide: "hair" | "flesh";
  readonly catalogueNote: string;
};

export const calculateHairlineFleshNoteGenerator = (
  input: HairlineFleshNoteGeneratorInput,
): HairlineFleshNoteGeneratorOutput => {
  const firstPageSide = input.firstPageSide ?? "hair";
  const versoSkinSide = firstPageSide === "hair" ? "flesh" : "hair";
  return {
    rectoSkinSide: firstPageSide,
    versoSkinSide,
    catalogueNote: `Recto shows the ${firstPageSide} side and verso the ${versoSkinSide} side.`,
  };
};

export const hairlineFleshNoteGeneratorExample = {
  input: { firstPageSide: "hair" },
  output: {
    rectoSkinSide: "hair",
    versoSkinSide: "flesh",
    catalogueNote: "Recto shows the hair side and verso the flesh side.",
  },
} satisfies ToolExample<
  HairlineFleshNoteGeneratorInput,
  HairlineFleshNoteGeneratorOutput
>;

export const hairlineFleshNoteGeneratorTool = createSimpleTool({
  id: "paleography/hairline-flesh-note-generator",
  title: "Hair/Flesh Note Generator",
  description:
    "Generate the standard catalogue hair/flesh note for a leaf from which skin side faces the first page, deriving the opposite side for the verso with exact string construction.",
  inputs: [
    {
      default: "hair",
      description: "Skin side facing the recto (first page).",
      enum: ["hair", "flesh"],
      id: "firstPageSide",
      kind: "string",
      label: "First page side",
    },
  ],
  outputs: [
    {
      description: "Skin side of the recto.",
      id: "rectoSkinSide",
      enum: ["hair", "flesh"],
      kind: "string",
      label: "Recto side",
    },
    {
      description: "Skin side of the verso.",
      id: "versoSkinSide",
      enum: ["hair", "flesh"],
      kind: "string",
      label: "Verso side",
    },
    {
      description: "Ready-to-paste catalogue note.",
      id: "catalogueNote",
      kind: "string",
      label: "Catalogue note",
    },
  ],
  calculate: (input) =>
    calculateHairlineFleshNoteGenerator({
      firstPageSide:
        input.firstPageSide as HairlineFleshNoteGeneratorInput["firstPageSide"],
    }),
});

export const runHairlineFleshNoteGenerator =
  hairlineFleshNoteGeneratorTool.execute;
export default hairlineFleshNoteGeneratorTool;
