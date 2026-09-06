import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyMixedCementBatchVolumesM3: readonly number[];
  readonly observedCementDryMassKg: readonly number[];
  readonly observedIndependentEntrainedGasVolumesM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedGasCorrectedSlurryYieldM3PerKg: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyMixedCementBatchVolumesM3",
    label: "Observed already mixed cement batch volumes m3",
    kind: "numberList",
  },
  {
    id: "observedCementDryMassKg",
    label: "Observed cement dry mass kg",
    kind: "numberList",
  },
  {
    id: "observedIndependentEntrainedGasVolumesM3",
    label: "Observed independent entrained gas volumes m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCementDryMassKg.forEach((v) =>
    positive(v, "observedCementDryMassKg"),
  );
  input.observedAlreadyMixedCementBatchVolumesM3.forEach((v) =>
    nonnegative(v, "observedAlreadyMixedCementBatchVolumesM3"),
  );
  input.observedIndependentEntrainedGasVolumesM3.forEach((v) =>
    nonnegative(v, "observedIndependentEntrainedGasVolumesM3"),
  );
  aligned(
    input.observedAlreadyMixedCementBatchVolumesM3,
    input.observedCementDryMassKg,
    "observedAlreadyMixedCementBatchVolumesM3",
  );
  aligned(
    input.observedAlreadyMixedCementBatchVolumesM3,
    input.observedIndependentEntrainedGasVolumesM3,
    "observedAlreadyMixedCementBatchVolumesM3",
  );
  const fluid = input.observedAlreadyMixedCementBatchVolumesM3.map((v, i) => {
    const volume = v - input.observedIndependentEntrainedGasVolumesM3[i];
    nonnegative(volume, "slurry liquid/solid envelope");
    return volume;
  });
  return {
    observedGasCorrectedSlurryYieldM3PerKg:
      sum(fluid) / sum(input.observedCementDryMassKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyMixedCementBatchVolumesM3: [2, 3],
  observedCementDryMassKg: [100, 200],
  observedIndependentEntrainedGasVolumesM3: [0.1, 0.2],
} satisfies Input;
export const exampleOutput = {
  observedGasCorrectedSlurryYieldM3PerKg: 0.015666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/cement-slurry-yield",
  title: "Petroleum Cement Slurry Yield Calculator",
  description:
    "Audit already mixed cement batch yield per weighed dry cement after independent gas-envelope correction, no mixture recipe, cement placement or seal integrity claim. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGasCorrectedSlurryYieldM3PerKg",
      label: "Observed gas corrected slurry yield m3 per kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyMixedCementBatchVolumesM3:
        value.observedAlreadyMixedCementBatchVolumesM3 as readonly number[],
      observedCementDryMassKg:
        value.observedCementDryMassKg as readonly number[],
      observedIndependentEntrainedGasVolumesM3:
        value.observedIndependentEntrainedGasVolumesM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
