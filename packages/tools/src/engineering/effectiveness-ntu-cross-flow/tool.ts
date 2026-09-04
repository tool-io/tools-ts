import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly ntu: number;
  readonly capacityRatio: number;
  readonly callerBothStreamsUnmixedVerified: boolean;
}>;
export type Output = Readonly<{
  readonly crossflowUnmixedEffectiveness: number;
}>;
const inputFields = [
  { id: "ntu", label: "Ntu", kind: "number" },
  { id: "capacityRatio", label: "Capacity ratio", kind: "number" },
  {
    id: "callerBothStreamsUnmixedVerified",
    label: "Caller both streams unmixed verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.ntu, "ntu");
  fraction(input.capacityRatio, "capacityRatio");
  if (!input.callerBothStreamsUnmixedVerified)
    simpleError(
      "geometry",
      "Both streams unmixed crossflow empirical NTU correlation required.",
    );
  const n = input.ntu,
    c = input.capacityRatio;
  return {
    crossflowUnmixedEffectiveness:
      n === 0
        ? 0
        : c === 0
          ? -Math.expm1(-n)
          : -Math.expm1((Math.expm1(-c * n ** 0.78) * n ** 0.22) / c),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ntu: 1,
  capacityRatio: 0.5,
  callerBothStreamsUnmixedVerified: true,
} satisfies Input;
export const exampleOutput = {
  crossflowUnmixedEffectiveness: 0.5447637120146873,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/effectiveness-ntu-cross-flow",
  title: "Cross-Flow NTU Effectiveness Calculator",
  description:
    "Both-unmixed crossflow empirical ε=1−exp[N^.22/C(exp(−CN^.78)−1)], finite C=0 and NTU=0 limits; not existing parallel-flow law. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "crossflowUnmixedEffectiveness",
      label: "Crossflow unmixed effectiveness",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ntu: value.ntu as number,
      capacityRatio: value.capacityRatio as number,
      callerBothStreamsUnmixedVerified:
        value.callerBothStreamsUnmixedVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
