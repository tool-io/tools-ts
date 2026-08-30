import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const zirconiaEntries = {
  density: {
    keyDate: "material property",
    statement:
      "NGK lists zirconia density near 6.0 grams per cubic centimetre, depending on the zirconia grade and processing.",
  },
  hardness: {
    keyDate: "material property",
    statement:
      "NGK gives zirconia a typical Mohs hardness range of 8.0 to 8.5; Mohs values are an ordinal scratch-hardness scale, not impact toughness.",
  },
  toughness: {
    keyDate: "material property",
    statement:
      "Kyocera describes zirconia as a high-strength ceramic with high fracture toughness relative to many other ceramics, while noting properties vary with product configuration and manufacture.",
  },
  watchUse: {
    keyDate: "decorative use",
    statement:
      "Kyocera identifies polished zirconia as a decorative watch material because it can provide a high-quality mirror surface.",
  },
  impactCaution: {
    keyDate: "case-design limitation",
    statement:
      "Do not translate zirconia's scratch hardness into unbreakability. Case behavior also depends on toughness, brittleness, geometry, machining, finish, and impact loading.",
  },
} as const;

export type ZirconiaPropertyFocus = keyof typeof zirconiaEntries;

export type ZirconiaPropertyLookupInput = {
  readonly propertyFocus: ZirconiaPropertyFocus;
};

export type ZirconiaPropertyLookupOutput = {
  readonly keyDate: string;
  readonly propertyFocus: ZirconiaPropertyFocus;
  readonly verifiedStatement: string;
};

export const lookupZirconiaCeramicProperty = (
  input: ZirconiaPropertyLookupInput,
): ZirconiaPropertyLookupOutput => {
  const entry = zirconiaEntries[input.propertyFocus];
  if (entry === undefined)
    simpleError(
      "propertyFocus",
      "Zirconia property focus is not supported.",
      "unsupported_property_focus",
    );
  return {
    keyDate: entry.keyDate,
    propertyFocus: input.propertyFocus,
    verifiedStatement: entry.statement,
  };
};

export const zirconiaPropertyExample = {
  input: { propertyFocus: "hardness" },
  output: {
    keyDate: "material property",
    propertyFocus: "hardness",
    verifiedStatement:
      "NGK gives zirconia a typical Mohs hardness range of 8.0 to 8.5; Mohs values are an ordinal scratch-hardness scale, not impact toughness.",
  },
} satisfies ToolExample<
  ZirconiaPropertyLookupInput,
  ZirconiaPropertyLookupOutput
>;

export const zirconiaPropertyTool = createSimpleTool({
  calculate: (input) =>
    lookupZirconiaCeramicProperty({
      propertyFocus: input.propertyFocus as ZirconiaPropertyFocus,
    }),
  description:
    "Return a technical zirconia hardness, density, toughness, watch-use, or impact-design fact without translating scratch hardness into unbreakability.",
  id: "horology/zirconia-ceramic-case-property-lookup",
  inputs: [
    {
      enum: ["hardness", "density", "toughness", "watchUse", "impactCaution"],
      id: "propertyFocus",
      kind: "string",
      label: "Zirconia ceramic case property focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Property context" },
    {
      id: "propertyFocus",
      kind: "string",
      label: "Zirconia ceramic case property focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified zirconia statement",
    },
  ],
  title: "Zirconia Ceramic Case Property Lookup",
});

export const runZirconiaProperty = zirconiaPropertyTool.execute;
export default zirconiaPropertyTool;
