import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, dna } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly startCodonIndex: number;
  readonly minimumSpacingBp: number;
  readonly maximumSpacingBp: number;
}>;
export type Output = Readonly<{
  readonly bindingSiteStarts: readonly number[];
  readonly spacingsBp: readonly number[];
  readonly supportedSites: number;
}>;
export const calculate = (input: Input): Output => {
  const s = dna(input.sequence);
  count(input.startCodonIndex, "startCodonIndex");
  count(input.minimumSpacingBp, "minimumSpacingBp");
  count(input.maximumSpacingBp, "maximumSpacingBp");
  if (
    s.slice(input.startCodonIndex, input.startCodonIndex + 3) !== "ATG" ||
    input.maximumSpacingBp < input.minimumSpacingBp
  )
    simpleError(
      "startCodonIndex",
      "An ATG start and ordered spacing limits required.",
    );
  const bindingSiteStarts: number[] = [],
    spacingsBp: number[] = [];
  for (let i = 0; i + 6 <= input.startCodonIndex; i++)
    if (s.slice(i, i + 6) === "AGGAGG") {
      const gap = input.startCodonIndex - (i + 6);
      if (gap >= input.minimumSpacingBp && gap <= input.maximumSpacingBp) {
        bindingSiteStarts.push(i);
        spacingsBp.push(gap);
      }
    }
  return {
    bindingSiteStarts,
    spacingsBp,
    supportedSites: bindingSiteStarts.length,
  };
};
export const exampleInput = {
  sequence: "AGGAGGAAAAATG",
  startCodonIndex: 10,
  minimumSpacingBp: 3,
  maximumSpacingBp: 8,
} satisfies Input;
export const exampleOutput = {
  bindingSiteStarts: [0],
  spacingsBp: [4],
  supportedSites: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/ribosome-binding-spacing",
  title: "Ribosome Binding Spacing",
  description:
    "Locate AGGAGG ribosome-binding motifs at compatible spacing before a specified ATG start.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "startCodonIndex", label: "Start codon index", kind: "integer" },
    { id: "minimumSpacingBp", label: "Minimum spacing bp", kind: "integer" },
    { id: "maximumSpacingBp", label: "Maximum spacing bp", kind: "integer" },
  ],
  outputs: [
    {
      id: "bindingSiteStarts",
      label: "Binding site starts",
      kind: "numberList",
    },
    { id: "spacingsBp", label: "Spacings bp", kind: "numberList" },
    { id: "supportedSites", label: "Supported sites", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      startCodonIndex: value.startCodonIndex as number,
      minimumSpacingBp: value.minimumSpacingBp as number,
      maximumSpacingBp: value.maximumSpacingBp as number,
    }),
});
export const run = tool.execute;
export default tool;
