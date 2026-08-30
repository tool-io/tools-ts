import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const coatingEntries = {
  doubleSide: {
    keyDate: "product-specific",
    statement:
      "A double-sided AR treatment coats both crystal faces to reduce reflections from each surface; it is not a single universal coating construction.",
  },
  opticalEffect: {
    keyDate: "anti-reflective treatment",
    statement:
      "An anti-reflective treatment is a thin optical coating intended to reduce surface reflection and improve dial visibility; residual reflection and tint can remain.",
  },
  singleSide: {
    keyDate: "common construction",
    statement:
      "A single-sided treatment is applied to one face only, commonly the inner face of a watch crystal to reduce reflection while protecting the outer face from coating damage.",
  },
  standard: {
    keyDate: "ISO 14368-4:2020",
    statement:
      "ISO 14368-4 defines terms, test methods, and evaluation for anti-reflective treatments on sapphire watch-glasses, with mineral watch-glasses as a reference.",
  },
  damageCaution: {
    keyDate: "material property",
    statement:
      "Oris notes that AR coatings are less scratch-resistant than sapphire, so coating location and damage risk are design considerations rather than proof of inferiority.",
  },
} as const;

export type ArCoatingFocus = keyof typeof coatingEntries;

export type ArCoatingLookupInput = {
  readonly coatingFocus: ArCoatingFocus;
};

export type ArCoatingLookupOutput = {
  readonly coatingFocus: ArCoatingFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupSapphireArCoatingSide = (
  input: ArCoatingLookupInput,
): ArCoatingLookupOutput => {
  const entry = coatingEntries[input.coatingFocus];
  if (entry === undefined)
    simpleError(
      "coatingFocus",
      "Sapphire AR coating focus is not supported.",
      "unsupported_coating_focus",
    );
  return {
    coatingFocus: input.coatingFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const arCoatingExample = {
  input: { coatingFocus: "standard" },
  output: {
    coatingFocus: "standard",
    keyDate: "ISO 14368-4:2020",
    verifiedStatement:
      "ISO 14368-4 defines terms, test methods, and evaluation for anti-reflective treatments on sapphire watch-glasses, with mineral watch-glasses as a reference.",
  },
} satisfies ToolExample<ArCoatingLookupInput, ArCoatingLookupOutput>;

export const arCoatingTool = createSimpleTool({
  calculate: (input) =>
    lookupSapphireArCoatingSide({
      coatingFocus: input.coatingFocus as ArCoatingFocus,
    }),
  description:
    "Return ISO 14368-4, single-side, double-side, optical-effect, or damage-caution facts for sapphire watch-crystal AR coating.",
  id: "horology/sapphire-ar-coating-side-lookup",
  inputs: [
    {
      enum: [
        "standard",
        "singleSide",
        "doubleSide",
        "opticalEffect",
        "damageCaution",
      ],
      id: "coatingFocus",
      kind: "string",
      label: "Sapphire AR coating focus",
    },
  ],
  outputs: [
    { id: "coatingFocus", kind: "string", label: "Sapphire AR coating focus" },
    { id: "keyDate", kind: "string", label: "Standard or design context" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified sapphire AR statement",
    },
  ],
  title: "Sapphire AR Coating Side Lookup",
});

export const runArCoating = arCoatingTool.execute;
export default arCoatingTool;
