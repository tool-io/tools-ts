import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrayCurtisDissimilarityInput = {
  readonly a1: number;
  readonly a2: number;
  readonly b1: number;
  readonly b2: number;
};

export type BrayCurtisDissimilarityOutput = {
  readonly brayCurtisDissimilarity: number;
};

export const brayCurtisDissimilarityExample = {
  input: { a1: 10, a2: 20, b1: 15, b2: 5 },
  output: { brayCurtisDissimilarity: 0.4 },
} satisfies ToolExample<
  BrayCurtisDissimilarityInput,
  BrayCurtisDissimilarityOutput
>;

export const brayCurtisDissimilarityTool = createSimpleTool({
  id: "biology/bray-curtis-dissimilarity",
  title: "Bray-Curtis Dissimilarity",
  description:
    "Quantify compositional dissimilarity between two communities over two species with the Bray-Curtis index.",
  inputs: [
    {
      id: "a1",
      kind: "number",
      label: "Community A species 1 abundance",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "a2",
      kind: "number",
      label: "Community A species 2 abundance",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "b1",
      kind: "number",
      label: "Community B species 1 abundance",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "b2",
      kind: "number",
      label: "Community B species 2 abundance",
      minimum: 0,
      unit: "individuals",
    },
  ],
  outputs: [
    {
      id: "brayCurtisDissimilarity",
      kind: "number",
      label: "Bray-Curtis dissimilarity",
    },
  ],
  calculate: (input) => {
    const a1 = input.a1 as number;
    const a2 = input.a2 as number;
    const b1 = input.b1 as number;
    const b2 = input.b2 as number;
    const denominator = a1 + a2 + b1 + b2;
    if (denominator <= 0)
      simpleError(
        "a1",
        "At least one individual across both communities is required.",
        "empty_samples",
      );
    return {
      brayCurtisDissimilarity:
        (Math.abs(a1 - b1) + Math.abs(a2 - b2)) / denominator,
    };
  },
});
export const runBrayCurtisDissimilarity = brayCurtisDissimilarityTool.execute;
export default brayCurtisDissimilarityTool;
