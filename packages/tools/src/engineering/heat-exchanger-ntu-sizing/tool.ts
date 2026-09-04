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
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerTargetCounterflowEffectiveness: number;
  readonly capacityRatio: number;
  readonly minimumCapacityWK: number;
  readonly callerOverallCoefficientWM2K: number;
}>;
export type Output = Readonly<{
  readonly counterflowRequiredNtu: number;
  readonly counterflowRequiredAreaM2: number;
}>;
const inputFields = [
  {
    id: "callerTargetCounterflowEffectiveness",
    label: "Caller target counterflow effectiveness",
    kind: "number",
  },
  { id: "capacityRatio", label: "Capacity ratio", kind: "number" },
  { id: "minimumCapacityWK", label: "Minimum capacity w k", kind: "number" },
  {
    id: "callerOverallCoefficientWM2K",
    label: "Caller overall coefficient w m2 k",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.minimumCapacityWK, "minimumCapacityWK");
  positive(input.callerOverallCoefficientWM2K, "callerOverallCoefficientWM2K");
  fraction(
    input.callerTargetCounterflowEffectiveness,
    "callerTargetCounterflowEffectiveness",
  );
  fraction(input.capacityRatio, "capacityRatio");
  const e = input.callerTargetCounterflowEffectiveness,
    c = input.capacityRatio;
  if (e >= 1) simpleError("effectiveness", "Finite area requiresε<1.");
  const n = c === 1 ? e / (1 - e) : -Math.log((1 - e) / (1 - e * c)) / (1 - c);
  return {
    counterflowRequiredNtu: n,
    counterflowRequiredAreaM2:
      (n * input.minimumCapacityWK) / input.callerOverallCoefficientWM2K,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTargetCounterflowEffectiveness: 0.5,
  capacityRatio: 0.5,
  minimumCapacityWK: 10,
  callerOverallCoefficientWM2K: 2,
} satisfies Input;
export const exampleOutput = {
  counterflowRequiredNtu: 0.8109302162163288,
  counterflowRequiredAreaM2: 4.054651081081644,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/heat-exchanger-ntu-sizing",
  title: "NTU Heat Exchanger Sizing Calculator",
  description:
    "Invert COUNTERFLOW effectiveness to NTU and matched area, exact C=1 limit; not existing parallel-flow forward formula or assumed U. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "counterflowRequiredNtu",
      label: "Counterflow required ntu",
      kind: "number",
    },
    {
      id: "counterflowRequiredAreaM2",
      label: "Counterflow required area m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTargetCounterflowEffectiveness:
        value.callerTargetCounterflowEffectiveness as number,
      capacityRatio: value.capacityRatio as number,
      minimumCapacityWK: value.minimumCapacityWK as number,
      callerOverallCoefficientWM2K:
        value.callerOverallCoefficientWM2K as number,
    }),
});
export const run = tool.execute;
export default tool;
