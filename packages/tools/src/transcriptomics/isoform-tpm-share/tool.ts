import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly isoformIds: readonly string[];
  readonly isoformTpms: readonly number[];
}>;
export type Output = Readonly<{
  readonly isoformSharesPercent: readonly number[];
  readonly geneTpm: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.isoformIds.length === 0 ||
    input.isoformIds.length !== input.isoformTpms.length ||
    input.isoformTpms.some((v) => v < 0)
  )
    simpleError("isoformIds", "Aligned nonnegative isoform TPMs required.");
  const geneTpm = input.isoformTpms.reduce((a, b) => a + b, 0);
  if (geneTpm <= 0) simpleError("isoformTpms", "Total TPM must be positive.");
  return {
    isoformSharesPercent: input.isoformTpms.map((v) => (v / geneTpm) * 100),
    geneTpm,
  };
};

export const exampleInput = {
  isoformIds: ["x", "y"],
  isoformTpms: [20, 80],
} satisfies Input;
export const exampleOutput = {
  isoformSharesPercent: [20, 80],
  geneTpm: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/isoform-tpm-share",
  title: "Isoform TPM Share",
  description: "Normalize isoform TPMs to within-gene usage percentages.",
  inputs: [
    { id: "isoformIds", kind: "stringList", label: "Isoform ids" },
    { id: "isoformTpms", kind: "numberList", label: "Isoform tpms" },
  ],
  outputs: [
    {
      id: "isoformSharesPercent",
      kind: "numberList",
      label: "Isoform shares percent",
    },
    { id: "geneTpm", kind: "number", label: "Gene tpm" },
  ],
  calculate: (value) =>
    calculate({
      isoformIds: value.isoformIds as readonly string[],
      isoformTpms: value.isoformTpms as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
