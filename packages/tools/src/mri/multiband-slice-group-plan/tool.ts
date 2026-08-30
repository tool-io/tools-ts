import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count } from "../shared.js";
export type Input = Readonly<{
  readonly sliceCount: number;
  readonly multibandFactor: number;
}>;
export type Output = Readonly<{
  readonly simultaneousSliceGroups: readonly (readonly number[])[];
  readonly groupCount: number;
}>;
const inputFields = [
  { id: "sliceCount", label: "Slice count", kind: "integer" },
  { id: "multibandFactor", label: "Multiband factor", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.sliceCount, "sliceCount", 1);
  count(input.multibandFactor, "multibandFactor", 1);
  const groupCount = Math.ceil(input.sliceCount / input.multibandFactor);
  if (
    input.sliceCount > 16384 ||
    groupCount > 128 ||
    input.multibandFactor > 128
  )
    simpleError(
      "sliceCount",
      "At most 128 groups of at most 128 slices supported.",
    );
  const simultaneousSliceGroups = Array.from({ length: groupCount }, (_, i) =>
    Array.from(
      { length: input.multibandFactor },
      (_, j) => i + j * groupCount,
    ).filter((v) => v < input.sliceCount),
  );
  return { simultaneousSliceGroups, groupCount };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sliceCount: 10,
  multibandFactor: 3,
} satisfies Input;
export const exampleOutput = {
  simultaneousSliceGroups: [
    [0, 4, 8],
    [1, 5, 9],
    [2, 6],
    [3, 7],
  ],
  groupCount: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/multiband-slice-group-plan",
  title: "SMS Multiband Factor",
  description:
    "Plan spatially interleaved simultaneous-slice groups and retain smaller tail groups; CAIPI shifts, RF peak power and sequence timing are external.",
  inputs: inputFields,
  outputs: [
    {
      id: "simultaneousSliceGroups",
      label: "Simultaneous slice groups",
      kind: "matrix",
    },
    { id: "groupCount", label: "Group count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sliceCount: value.sliceCount as number,
      multibandFactor: value.multibandFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
