import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sirna: string;
  readonly minimumGcPercent: number;
  readonly maximumGcPercent: number;
}>;
export type Output = Readonly<{
  readonly gcPercent: number;
  readonly withinRange: boolean;
}>;

export const calculate = (input: Input): Output => {
  const s = input.sirna.toUpperCase().replace(/U/g, "T");
  if (!/^[ACGT]+$/.test(s) || input.minimumGcPercent > input.maximumGcPercent)
    simpleError(
      "sirna",
      "A nonempty nucleotide sequence and ordered bounds are required.",
    );
  const gcPercent = ((s.match(/[GC]/g) ?? []).length / s.length) * 100;
  return {
    gcPercent,
    withinRange:
      gcPercent >= input.minimumGcPercent &&
      gcPercent <= input.maximumGcPercent,
  };
};

export const exampleInput = {
  sirna: "GCGCAATT",
  minimumGcPercent: 30,
  maximumGcPercent: 60,
} satisfies Input;
export const exampleOutput = {
  gcPercent: 50,
  withinRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/sirna-gc-screen",
  title: "siRNA GC Screen",
  description:
    "Screen siRNA GC percentage against user-selected design bounds.",
  inputs: [
    { id: "sirna", kind: "string", label: "siRNA" },
    { id: "minimumGcPercent", kind: "number", label: "Minimum gc percent" },
    { id: "maximumGcPercent", kind: "number", label: "Maximum gc percent" },
  ],
  outputs: [
    { id: "gcPercent", kind: "number", label: "Gc percent" },
    { id: "withinRange", kind: "boolean", label: "Within range" },
  ],
  calculate: (value) =>
    calculate({
      sirna: value.sirna as string,
      minimumGcPercent: value.minimumGcPercent as number,
      maximumGcPercent: value.maximumGcPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
