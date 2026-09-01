import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly flatSeamLengthM: number;
  readonly observedClampPositionsM: readonly number[];
  readonly callerMaximumClampGapM: number;
}>;
export type Output = Readonly<{
  readonly seamBoundaryAndClampGapsM: readonly number[];
  readonly gapsAboveCallerAssemblyPolicy: readonly number[];
}>;
const inputFields = [
  { id: "flatSeamLengthM", label: "Flat seam length m", kind: "number" },
  {
    id: "observedClampPositionsM",
    label: "Observed clamp positions m",
    kind: "numberList",
  },
  {
    id: "callerMaximumClampGapM",
    label: "Caller maximum clamp gap m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.flatSeamLengthM, "flatSeamLengthM");
  positive(input.callerMaximumClampGapM, "callerMaximumClampGapM");
  sequence(input.observedClampPositionsM, "clamps");
  if (input.observedClampPositionsM.some((v) => v > input.flatSeamLengthM))
    simpleError("clamps", "Clamp positions must lie on seam.");
  const p = [0, ...input.observedClampPositionsM, input.flatSeamLengthM],
    gaps = p.slice(1).map((v, i) => v - p[i]);
  return {
    seamBoundaryAndClampGapsM: gaps,
    gapsAboveCallerAssemblyPolicy: gaps.flatMap((v, i) =>
      v > input.callerMaximumClampGapM ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  flatSeamLengthM: 3,
  observedClampPositionsM: [0.5, 1.5, 2.5],
  callerMaximumClampGapM: 1,
} satisfies Input;
export const exampleOutput = {
  seamBoundaryAndClampGapsM: [0.5, 1, 1, 0.5],
  gapsAboveCallerAssemblyPolicy: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/keystone-clamp-spacing-flats-lookup",
  title: "Keystone Clamp Spacing Flats Lookup",
  description:
    "Audit actual scenic-flat clamp spacing including seam-boundary tails under caller assembly policy, not fastener/structure load adequacy or universal clamp interval.",
  inputs: inputFields,
  outputs: [
    {
      id: "seamBoundaryAndClampGapsM",
      label: "Seam boundary and clamp gaps m",
      kind: "numberList",
    },
    {
      id: "gapsAboveCallerAssemblyPolicy",
      label: "Gaps above caller assembly policy",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      flatSeamLengthM: value.flatSeamLengthM as number,
      observedClampPositionsM:
        value.observedClampPositionsM as readonly number[],
      callerMaximumClampGapM: value.callerMaximumClampGapM as number,
    }),
});
export const run = tool.execute;
export default tool;
