import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const ASCOMA_TYPES = [
  "apothecium",
  "perithecium",
  "cleistothecium",
  "hysterothecium",
] as const;

export type AscomaTypeClassifierInput = {
  readonly type: (typeof ASCOMA_TYPES)[number];
};

export type AscomaTypeClassifierOutput = {
  readonly ascomaClass: AscomaTypeClassifierInput["type"];
  readonly diagnosticMorphology: string;
};

export const ascomaTypeClassifierExample = {
  input: { type: "apothecium" },
  output: {
    ascomaClass: "apothecium",
    diagnosticMorphology:
      "Open cup- or disc-shaped ascoma with an exposed hymenium.",
  },
} satisfies ToolExample<AscomaTypeClassifierInput, AscomaTypeClassifierOutput>;

const MORPHOLOGY: Record<AscomaTypeClassifierInput["type"], string> = {
  apothecium: "Open cup- or disc-shaped ascoma with an exposed hymenium.",
  cleistothecium: "Closed ascoma without a preformed opening.",
  hysterothecium: "Elongated ascoma that opens through a longitudinal slit.",
  perithecium: "Flask-shaped ascoma that releases spores through an ostiole.",
};

export const calculateAscomaTypeClassifier = (
  input: AscomaTypeClassifierInput,
): AscomaTypeClassifierOutput => {
  const diagnosticMorphology = MORPHOLOGY[input.type];
  if (diagnosticMorphology === undefined)
    return simpleError(
      "type",
      "Select a supported ascoma type.",
      "invalid_type",
    );
  return { ascomaClass: input.type, diagnosticMorphology };
};

export const ascomaTypeClassifierTool = createSimpleTool({
  id: "mycology/ascoma-type-classifier",
  title: "Ascoma Type Mapper",
  description: "Map a reported fruiting body type to its ascoma class.",
  inputs: [
    {
      enum: ASCOMA_TYPES,
      id: "type",
      kind: "string",
      label: "Type",
    },
  ],
  outputs: [
    {
      enum: ASCOMA_TYPES,
      id: "ascomaClass",
      kind: "string",
      label: "Ascoma class",
    },
    {
      id: "diagnosticMorphology",
      kind: "string",
      label: "Diagnostic morphology",
    },
  ],
  calculate: (input) =>
    calculateAscomaTypeClassifier({
      type: input.type as AscomaTypeClassifierInput["type"],
    }),
});
export const runAscomaTypeClassifier = ascomaTypeClassifierTool.execute;
export default ascomaTypeClassifierTool;
