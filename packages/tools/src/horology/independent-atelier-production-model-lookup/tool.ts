import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const atelierEntries = {
  bespokeDesign: {
    keyDate: "model-specific",
    statement:
      "Small-series independent production can support original design decisions that are not constrained by a large existing collection, but originality must be evaluated reference by reference.",
  },
  manufacturingDepth: {
    keyDate: "maker-specific",
    statement:
      "Depth of manufacture includes what is designed, machined, finished, assembled, adjusted, cased, and serviced in-house; a brand label does not establish that depth.",
  },
  marketTermCaution: {
    keyDate: "current usage",
    statement:
      "Independent can mean legally private or outside a conglomerate, while independent watchmaking in collector usage often also implies small-scale original manufacture; the sense must be stated.",
  },
  ownership: {
    keyDate: "current ownership",
    statement:
      "Ownership independence concerns corporate control, not workshop size, technical depth, or output; independently owned industrial houses can still be large.",
  },
  productionScale: {
    keyDate: "maker-specific",
    statement:
      "Small-series production means limited annual output or runs as declared by the maker; there is no universal piece-count boundary for every independent atelier.",
  },
} as const;

export type AtelierModelFocus = keyof typeof atelierEntries;

export type AtelierModelLookupInput = {
  readonly modelFocus: AtelierModelFocus;
};

export type AtelierModelLookupOutput = {
  readonly keyDate: string;
  readonly modelFocus: AtelierModelFocus;
  readonly verifiedStatement: string;
};

export const lookupIndependentAtelierProductionModel = (
  input: AtelierModelLookupInput,
): AtelierModelLookupOutput => {
  const entry = atelierEntries[input.modelFocus];
  if (entry === undefined)
    simpleError(
      "modelFocus",
      "Independent-atelier model focus is not supported.",
      "unsupported_model_focus",
    );
  return {
    keyDate: entry.keyDate,
    modelFocus: input.modelFocus,
    verifiedStatement: entry.statement,
  };
};

export const atelierModelExample = {
  input: { modelFocus: "productionScale" },
  output: {
    keyDate: "maker-specific",
    modelFocus: "productionScale",
    verifiedStatement:
      "Small-series production means limited annual output or runs as declared by the maker; there is no universal piece-count boundary for every independent atelier.",
  },
} satisfies ToolExample<AtelierModelLookupInput, AtelierModelLookupOutput>;

export const atelierModelTool = createSimpleTool({
  calculate: (input) =>
    lookupIndependentAtelierProductionModel({
      modelFocus: input.modelFocus as AtelierModelFocus,
    }),
  description:
    "Define ownership, production scale, manufacturing depth, bespoke design, and terminology cautions for independent watchmaking without imposing a universal piece count.",
  id: "horology/independent-atelier-production-model-lookup",
  inputs: [
    {
      enum: [
        "ownership",
        "productionScale",
        "manufacturingDepth",
        "bespokeDesign",
        "marketTermCaution",
      ],
      id: "modelFocus",
      kind: "string",
      label: "Independent-atelier production model focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Scope or status" },
    {
      id: "modelFocus",
      kind: "string",
      label: "Independent-atelier production model focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Independent-atelier model statement",
    },
  ],
  title: "Independent Atelier Production Model Lookup",
});

export const runAtelierModel = atelierModelTool.execute;
export default atelierModelTool;
