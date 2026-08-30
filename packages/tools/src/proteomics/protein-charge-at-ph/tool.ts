import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinCharge } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly ph: number;
  readonly pkas: readonly number[];
}>;
export type Output = Readonly<{
  readonly netCharge: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.ph < 0 || input.ph > 14)
    simpleError("ph", "pH must be between zero and fourteen.");
  return { netCharge: proteinCharge(input.sequence, input.ph, input.pkas) };
};
export const exampleInput = {
  sequence: "A",
  ph: 7,
  pkas: [7, 7, 10, 12, 6, 4, 4, 8, 10],
} satisfies Input;
export const exampleOutput = { netCharge: 0 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-charge-at-ph",
  title: "Protein Charge At PH",
  description:
    "Estimate sequence net charge at pH from caller-supplied terminal and side-chain pKas.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "ph", label: "Ph", kind: "number" },
    { id: "pkas", label: "Pkas", kind: "numberList" },
  ],
  outputs: [{ id: "netCharge", label: "Net charge", kind: "number" }],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      ph: value.ph as number,
      pkas: value.pkas as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
