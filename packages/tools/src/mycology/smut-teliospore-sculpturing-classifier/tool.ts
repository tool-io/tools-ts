import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const smutTeliosporeSculpturingClassifierExample = {
  input: { sculpturing: "echinulate" },
  output: { sculpturingClass: "echinulate" },
} satisfies ToolExample<
  {
    readonly sculpturing: "echinulate" | "reticulate" | "smooth" | "verrucose";
  },
  {
    readonly sculpturingClass:
      "echinulate" | "reticulate" | "smooth" | "verrucose";
  }
>;

export const smutTeliosporeSculpturingClassifierTool = createSimpleTool({
  id: "mycology/smut-teliospore-sculpturing-classifier",
  title: "Teliospore Sculpturing",
  description:
    "Classify smut teliospore surface sculpturing as echinulate, verrucose, smooth, or reticulate.",
  inputs: [
    {
      enum: ["echinulate", "verrucose", "smooth", "reticulate"],
      id: "sculpturing",
      label: "Sculpturing",
      kind: "string",
    },
  ],
  outputs: [
    { id: "sculpturingClass", label: "Sculpturing class", kind: "string" },
  ],
  calculate: (input) => ({
    sculpturingClass: input.sculpturing as
      "echinulate" | "reticulate" | "smooth" | "verrucose",
  }),
});
export const runSmutTeliosporeSculpturingClassifier =
  smutTeliosporeSculpturingClassifierTool.execute;
export default smutTeliosporeSculpturingClassifierTool;
