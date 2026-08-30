import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const materialEntries = {
  acrylic: {
    keyDate: "mid-twentieth century onward",
    properties:
      "PMMA acrylic is flexible, less brittle than sapphire, readily scratched, and comparatively easy to repolish.",
    useCase:
      "Common in domed and integrated sports, tool, and military-watch crystals.",
  },
  datingCaution: {
    keyDate: "model-specific",
    properties:
      "The rise of acrylic and later sapphire was gradual, so a calendar year alone does not identify the original crystal material.",
    useCase:
      "Use reference-specific parts records, case construction, and physical material evidence for attribution.",
  },
  mineral: {
    keyDate: "traditional material",
    properties:
      "Mineral glass is a hard transparent crystal material but can chip or shatter and is not as scratch-resistant as sapphire.",
    useCase:
      "Used across traditional watch designs, commonly with metal case constructions.",
  },
  sapphire: {
    keyDate: "late twentieth century onward",
    properties:
      "Synthetic corundum sapphire is highly scratch-resistant but remains brittle in thin crystal geometries.",
    useCase:
      "Widely adopted for modern watch crystals where impact protection and manufacturing allow.",
  },
  transition: {
    keyDate: "roughly 1960s–1970s for acrylic, later for sapphire",
    properties:
      "Watchmaking sources describe glass as predominant through the middle of the twentieth century, a rise of plastic crystals in the 1960s and 1970s, and a later shift toward sapphire.",
    useCase:
      "Treat this as industry history, not a universal brand transition year.",
  },
} as const;

export type CrystalMaterialFocus = keyof typeof materialEntries;

export type CrystalMaterialLookupInput = {
  readonly materialFocus: CrystalMaterialFocus;
};

export type CrystalMaterialLookupOutput = {
  readonly keyDate: string;
  readonly materialFocus: CrystalMaterialFocus;
  readonly properties: string;
  readonly useCase: string;
};

export const lookupWatchCrystalMaterial = (
  input: CrystalMaterialLookupInput,
): CrystalMaterialLookupOutput => {
  const entry = materialEntries[input.materialFocus];
  if (entry === undefined)
    simpleError(
      "materialFocus",
      "Crystal material focus is not supported.",
      "unsupported_material_focus",
    );
  return {
    keyDate: entry.keyDate,
    materialFocus: input.materialFocus,
    properties: entry.properties,
    useCase: entry.useCase,
  };
};

export const crystalMaterialExample = {
  input: { materialFocus: "acrylic" },
  output: {
    keyDate: "mid-twentieth century onward",
    materialFocus: "acrylic",
    properties:
      "PMMA acrylic is flexible, less brittle than sapphire, readily scratched, and comparatively easy to repolish.",
    useCase:
      "Common in domed and integrated sports, tool, and military-watch crystals.",
  },
} satisfies ToolExample<
  CrystalMaterialLookupInput,
  CrystalMaterialLookupOutput
>;

export const crystalMaterialTool = createSimpleTool({
  calculate: (input) =>
    lookupWatchCrystalMaterial({
      materialFocus: input.materialFocus as CrystalMaterialFocus,
    }),
  description:
    "Compare acrylic, mineral, and sapphire crystal properties and retrieve the gradual material-transition history without inventing a brand-specific cutoff.",
  id: "horology/watch-crystal-material-comparison-lookup",
  inputs: [
    {
      enum: ["acrylic", "mineral", "sapphire", "transition", "datingCaution"],
      id: "materialFocus",
      kind: "string",
      label: "Watch crystal material focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Period or status" },
    {
      id: "materialFocus",
      kind: "string",
      label: "Watch crystal material focus",
    },
    { id: "properties", kind: "string", label: "Crystal properties" },
    { id: "useCase", kind: "string", label: "Use or dating context" },
  ],
  title: "Watch Crystal Material Comparison Lookup",
});

export const runCrystalMaterial = crystalMaterialTool.execute;
export default crystalMaterialTool;
