import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MorisitaHornIndexInput = {
  readonly a1: number;
  readonly a2: number;
  readonly b1: number;
  readonly b2: number;
};

export type MorisitaHornIndexOutput = {
  readonly morisitaHornIndex: number;
};

export const morisitaHornIndexExample = {
  input: { a1: 10, a2: 5, b1: 4, b2: 6 },
  output: { morisitaHornIndex: 0.8677685950413224 },
} satisfies ToolExample<MorisitaHornIndexInput, MorisitaHornIndexOutput>;

export const morisitaHornIndexTool = createSimpleTool({
  id: "biology/morisita-horn-index",
  title: "Morisita-Horn Counts",
  description:
    "Quantify overlap between two communities over two species from raw abundance counts with the Morisita-Horn index.",
  inputs: [
    {
      id: "a1",
      kind: "integer",
      label: "Community A species 1 count",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "a2",
      kind: "integer",
      label: "Community A species 2 count",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "b1",
      kind: "integer",
      label: "Community B species 1 count",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "b2",
      kind: "integer",
      label: "Community B species 2 count",
      minimum: 0,
      unit: "individuals",
    },
  ],
  outputs: [
    {
      id: "morisitaHornIndex",
      kind: "number",
      label: "Morisita-Horn index",
    },
  ],
  calculate: (input) => {
    const a1 = input.a1 as number;
    const a2 = input.a2 as number;
    const b1 = input.b1 as number;
    const b2 = input.b2 as number;
    const totalA = a1 + a2;
    const totalB = b1 + b2;
    if (totalA <= 0 || totalB <= 0)
      simpleError(
        "a1",
        "Each community must contain at least one individual.",
        "empty_samples",
      );
    const lambdaA = (a1 * a1 + a2 * a2) / (totalA * totalA);
    const lambdaB = (b1 * b1 + b2 * b2) / (totalB * totalB);
    return {
      morisitaHornIndex:
        (2 * (a1 * b1 + a2 * b2)) / ((lambdaA + lambdaB) * totalA * totalB),
    };
  },
});
export const runMorisitaHornIndex = morisitaHornIndexTool.execute;
export default morisitaHornIndexTool;
