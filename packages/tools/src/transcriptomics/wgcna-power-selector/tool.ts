import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly powers: readonly number[];
  readonly scaleFreeR2: readonly number[];
  readonly minimumR2: number;
}>;
export type Output = Readonly<{
  readonly selectedPower: number;
  readonly selectedR2: number;
  readonly qualifiedPowers: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  if (
    input.powers.length === 0 ||
    input.powers.length !== input.scaleFreeR2.length ||
    input.scaleFreeR2.some((v) => v < 0 || v > 1)
  )
    simpleError("powers", "Aligned powers and R² values are required.");
  const qualifiedPowers = input.powers.filter(
      (_, i) => input.scaleFreeR2[i] >= input.minimumR2,
    ),
    i = input.powers.findIndex(
      (_, i) => input.scaleFreeR2[i] >= input.minimumR2,
    );
  if (i < 0)
    simpleError("minimumR2", "No power reaches the supplied fit criterion.");
  return {
    selectedPower: input.powers[i],
    selectedR2: input.scaleFreeR2[i],
    qualifiedPowers,
  };
};

export const exampleInput = {
  powers: [2, 4, 6],
  scaleFreeR2: [0.5, 0.8, 0.85],
  minimumR2: 0.8,
} satisfies Input;
export const exampleOutput = {
  selectedPower: 4,
  selectedR2: 0.8,
  qualifiedPowers: [4, 6],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/wgcna-power-selector",
  title: "WGCNA Power Selector",
  description:
    "Select the first WGCNA power meeting a caller-supplied scale-free-fit criterion.",
  inputs: [
    { id: "powers", kind: "numberList", label: "Powers" },
    { id: "scaleFreeR2", kind: "numberList", label: "Scale free r 2" },
    { id: "minimumR2", kind: "number", label: "Minimum r 2" },
  ],
  outputs: [
    { id: "selectedPower", kind: "number", label: "Selected power" },
    { id: "selectedR2", kind: "number", label: "Selected r 2" },
    { id: "qualifiedPowers", kind: "numberList", label: "Qualified powers" },
  ],
  calculate: (value) =>
    calculate({
      powers: value.powers as readonly number[],
      scaleFreeR2: value.scaleFreeR2 as readonly number[],
      minimumR2: value.minimumR2 as number,
    }),
});
export const run = tool.execute;
export default tool;
