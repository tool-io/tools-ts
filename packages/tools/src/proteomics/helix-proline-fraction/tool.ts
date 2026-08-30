import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly prolineCount: number;
  readonly prolineFraction: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    prolineCount = [...s].filter((v) => v === "P").length;
  return { prolineCount, prolineFraction: prolineCount / s.length };
};
export const exampleInput = { sequence: "APPA" } satisfies Input;
export const exampleOutput = {
  prolineCount: 2,
  prolineFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/helix-proline-fraction",
  title: "Helix Proline Fraction",
  description: "Measure alpha-helix-disrupting proline fraction.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "prolineCount", label: "Proline count", kind: "number" },
    { id: "prolineFraction", label: "Proline fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
