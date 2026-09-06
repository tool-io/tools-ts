import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedReservoirWaterVolumesM3: readonly number[];
  readonly observedSameParcelStockWaterM3: readonly number[];
  readonly observedIndependentDissolvedGasCorrectionM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly gasCorrectedObservedWaterFvf: readonly number[];
}>;
const inputFields = [
  {
    id: "observedReservoirWaterVolumesM3",
    label: "Observed reservoir water volumes m3",
    kind: "numberList",
  },
  {
    id: "observedSameParcelStockWaterM3",
    label: "Observed same parcel stock water m3",
    kind: "numberList",
  },
  {
    id: "observedIndependentDissolvedGasCorrectionM3",
    label: "Observed independent dissolved gas correction m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSameParcelStockWaterM3.forEach((v) =>
    positive(v, "observedSameParcelStockWaterM3"),
  );
  input.observedReservoirWaterVolumesM3.forEach((v) =>
    nonnegative(v, "observedReservoirWaterVolumesM3"),
  );
  input.observedIndependentDissolvedGasCorrectionM3.forEach((v) =>
    nonnegative(v, "observedIndependentDissolvedGasCorrectionM3"),
  );
  aligned(
    input.observedReservoirWaterVolumesM3,
    input.observedSameParcelStockWaterM3,
    "observedReservoirWaterVolumesM3",
  );
  aligned(
    input.observedReservoirWaterVolumesM3,
    input.observedIndependentDissolvedGasCorrectionM3,
    "observedReservoirWaterVolumesM3",
  );
  return {
    gasCorrectedObservedWaterFvf: input.observedReservoirWaterVolumesM3.map(
      (v, i) => {
        const corrected =
          v - input.observedIndependentDissolvedGasCorrectionM3[i];
        positive(corrected, "corrected water volume");
        return corrected / input.observedSameParcelStockWaterM3[i];
      },
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedReservoirWaterVolumesM3: [2, 3],
  observedSameParcelStockWaterM3: [1, 2],
  observedIndependentDissolvedGasCorrectionM3: [0.1, 0.2],
} satisfies Input;
export const exampleOutput = {
  gasCorrectedObservedWaterFvf: [1.9, 1.4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/formation-volume-factor-water",
  title: "Petroleum Formation Volume Factor Water Calculator",
  description:
    "Infer measured water formation-volume factor from same-parcel reservoir/stock volumes after independently measured gas-envelope correction, no generic liquid density ratio or universal PVT correlation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "gasCorrectedObservedWaterFvf",
      label: "Gas corrected observed water fvf",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedReservoirWaterVolumesM3:
        value.observedReservoirWaterVolumesM3 as readonly number[],
      observedSameParcelStockWaterM3:
        value.observedSameParcelStockWaterM3 as readonly number[],
      observedIndependentDissolvedGasCorrectionM3:
        value.observedIndependentDissolvedGasCorrectionM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
