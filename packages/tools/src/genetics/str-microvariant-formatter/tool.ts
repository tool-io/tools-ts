import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly completeRepeats: number;
  readonly partialRepeatBases: number;
  readonly motifLength: number;
}>;
export type Output = Readonly<{
  readonly alleleLabel: string;
  readonly repeatRegionBases: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.completeRepeats, "completeRepeats");
  count(input.partialRepeatBases, "partialRepeatBases");
  count(input.motifLength, "motifLength", 1);
  if (input.partialRepeatBases >= input.motifLength)
    simpleError(
      "partialRepeatBases",
      "Partial-repeat bases must be shorter than a full motif.",
    );
  return {
    alleleLabel:
      String(input.completeRepeats) +
      (input.partialRepeatBases ? "." + input.partialRepeatBases : ""),
    repeatRegionBases:
      input.completeRepeats * input.motifLength + input.partialRepeatBases,
  };
};
export const exampleInput = {
  completeRepeats: 12,
  partialRepeatBases: 3,
  motifLength: 4,
} satisfies Input;
export const exampleOutput = {
  alleleLabel: "12.3",
  repeatRegionBases: 51,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/str-microvariant-formatter",
  title: "STR Microvariant Formatter",
  description:
    "Format an STR microvariant allele from complete repeats and residual bases; decimal suffix is not a fraction.",
  inputs: [
    { id: "completeRepeats", label: "Complete repeats", kind: "integer" },
    {
      id: "partialRepeatBases",
      label: "Partial repeat bases",
      kind: "integer",
    },
    { id: "motifLength", label: "Motif length", kind: "integer" },
  ],
  outputs: [
    { id: "alleleLabel", label: "Allele label", kind: "string" },
    { id: "repeatRegionBases", label: "Repeat region bases", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      completeRepeats: value.completeRepeats as number,
      partialRepeatBases: value.partialRepeatBases as number,
      motifLength: value.motifLength as number,
    }),
});
export const run = tool.execute;
export default tool;
