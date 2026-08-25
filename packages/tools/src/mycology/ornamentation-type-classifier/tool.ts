import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type OrnamentationTypeClassifierInput = {
  readonly type:
    "punctate" | "reticulate" | "ridged" | "smooth" | "spiny" | "warted";
};

export type OrnamentationTypeClassifierOutput = {
  readonly ornamentationClass: OrnamentationTypeClassifierInput["type"];
};

export const ornamentationTypeClassifierExample = {
  input: { type: "reticulate" },
  output: { ornamentationClass: "reticulate" },
} satisfies ToolExample<
  OrnamentationTypeClassifierInput,
  OrnamentationTypeClassifierOutput
>;

const ORNAMENTATION_CLASSES = [
  "smooth",
  "punctate",
  "warted",
  "spiny",
  "ridged",
  "reticulate",
] as const;

export const ornamentationTypeClassifierTool = createSimpleTool({
  id: "mycology/ornamentation-type-classifier",
  title: "Ornamentation Classifier",
  description:
    "Validate and pass through a spore ornamentation type classification.",
  inputs: [
    {
      enum: ORNAMENTATION_CLASSES,
      id: "type",
      kind: "string",
      label: "Ornamentation type",
    },
  ],
  outputs: [
    {
      id: "ornamentationClass",
      label: "Ornamentation class",
      kind: "string",
    },
  ],
  calculate: (input) => ({
    ornamentationClass: input.type as OrnamentationTypeClassifierInput["type"],
  }),
});
export const runOrnamentationTypeClassifier =
  ornamentationTypeClassifierTool.execute;
export default ornamentationTypeClassifierTool;
