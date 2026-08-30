import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly forwardPrimer: string;
  readonly reversePrimer: string;
  readonly maximumCpgCount: number;
}>;
export type Output = Readonly<{
  readonly forwardCpgCount: number;
  readonly reverseCpgCount: number;
  readonly totalCpgCount: number;
  readonly passesConstraint: boolean;
}>;

export const calculate = (input: Input): Output => {
  const count = (sequence: string) =>
      (sequence.toUpperCase().match(/CG/g) ?? []).length,
    forwardCpgCount = count(input.forwardPrimer),
    reverseCpgCount = count(input.reversePrimer),
    totalCpgCount = forwardCpgCount + reverseCpgCount;
  return {
    forwardCpgCount,
    reverseCpgCount,
    totalCpgCount,
    passesConstraint: totalCpgCount <= input.maximumCpgCount,
  };
};

export const exampleInput = {
  forwardPrimer: "ATCGAT",
  reversePrimer: "TTTTAA",
  maximumCpgCount: 1,
} satisfies Input;
export const exampleOutput = {
  forwardCpgCount: 1,
  reverseCpgCount: 0,
  totalCpgCount: 1,
  passesConstraint: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      forwardPrimer: input.forwardPrimer as string,
      reversePrimer: input.reversePrimer as string,
      maximumCpgCount: input.maximumCpgCount as number,
    }),
  description:
    "Count CpGs in bisulfite primer sequences against a supplied maximum.",
  id: "epigenetics/bisulfite-primer-cpg-check",
  inputs: [
    { id: "forwardPrimer", label: "Forward primer", kind: "string" },
    { id: "reversePrimer", label: "Reverse primer", kind: "string" },
    {
      id: "maximumCpgCount",
      label: "Maximum CpG count",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "forwardCpgCount",
      label: "Forward-primer CpGs",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "reverseCpgCount",
      label: "Reverse-primer CpGs",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "totalCpgCount",
      label: "Total primer CpGs",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "passesConstraint",
      label: "Within supplied CpG constraint",
      kind: "boolean",
    },
  ],
  title: "Bisulfite Primer CpG Check",
});

export const run = tool.execute;
export default tool;
