import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HyphalSystemClassifierInput = {
  readonly binding?: boolean;
  readonly generative?: boolean;
  readonly skeletal?: boolean;
};

export type HyphalSystemClassifierOutput = {
  readonly hyphalSystem: "dimitic" | "monomitic" | "trimitic";
};

export const hyphalSystemClassifierExample = {
  input: { binding: false, generative: true, skeletal: false },
  output: { hyphalSystem: "monomitic" },
} satisfies ToolExample<
  HyphalSystemClassifierInput,
  HyphalSystemClassifierOutput
>;

export const hyphalSystemClassifierTool = createSimpleTool({
  id: "mycology/hyphal-system-classifier",
  title: "Hyphal System Classifier",
  description:
    "Classify a hyphal system as monomitic, dimitic, or trimitic from the presence of hyphal types.",
  inputs: [
    { id: "generative", kind: "boolean", label: "Generative hyphae" },
    { id: "skeletal", kind: "boolean", label: "Skeletal hyphae" },
    { id: "binding", kind: "boolean", label: "Binding hyphae" },
  ],
  outputs: [
    {
      enum: ["monomitic", "dimitic", "trimitic"],
      id: "hyphalSystem",
      label: "Hyphal system",
      kind: "string",
    },
  ],
  calculate: (input) => {
    const generative = input.generative as boolean;
    const skeletal = input.skeletal as boolean;
    const binding = input.binding as boolean;
    if (binding && skeletal && generative) return { hyphalSystem: "trimitic" };
    if ((skeletal || binding) && generative) return { hyphalSystem: "dimitic" };
    if (generative) return { hyphalSystem: "monomitic" };
    return simpleError(
      "generative",
      "A hyphal system requires at least generative hyphae.",
      "invalid_system",
    );
  },
});
export const runHyphalSystemClassifier = hyphalSystemClassifierTool.execute;
export default hyphalSystemClassifierTool;
