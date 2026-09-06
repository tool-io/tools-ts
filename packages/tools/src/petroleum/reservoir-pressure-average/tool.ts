import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedReservoirPatchPressuresPa: readonly number[];
  readonly observedPatchPoreVolumesM3: readonly number[];
  readonly callerIndependentDatumPressureCorrectionsPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly datumCorrectedPoreWeightedReservoirPressurePa: number;
}>;
const inputFields = [
  {
    id: "observedReservoirPatchPressuresPa",
    label: "Observed reservoir patch pressures pa",
    kind: "numberList",
  },
  {
    id: "observedPatchPoreVolumesM3",
    label: "Observed patch pore volumes m3",
    kind: "numberList",
  },
  {
    id: "callerIndependentDatumPressureCorrectionsPa",
    label: "Caller independent datum pressure corrections pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedReservoirPatchPressuresPa.forEach((v) =>
    positive(v, "observedReservoirPatchPressuresPa"),
  );
  input.observedPatchPoreVolumesM3.forEach((v) =>
    nonnegative(v, "observedPatchPoreVolumesM3"),
  );
  aligned(
    input.observedReservoirPatchPressuresPa,
    input.observedPatchPoreVolumesM3,
    "observedReservoirPatchPressuresPa",
  );
  aligned(
    input.observedReservoirPatchPressuresPa,
    input.callerIndependentDatumPressureCorrectionsPa,
    "observedReservoirPatchPressuresPa",
  );
  const w = weights(input.observedPatchPoreVolumesM3),
    corrected = input.observedReservoirPatchPressuresPa.map(
      (v, i) => v + input.callerIndependentDatumPressureCorrectionsPa[i],
    );
  corrected.forEach((v) => positive(v, "corrected pressure"));
  return {
    datumCorrectedPoreWeightedReservoirPressurePa: sum(
      corrected.map((v, i) => v * w[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedReservoirPatchPressuresPa: [100, 200],
  observedPatchPoreVolumesM3: [1, 3],
  callerIndependentDatumPressureCorrectionsPa: [10, -10],
} satisfies Input;
export const exampleOutput = {
  datumCorrectedPoreWeightedReservoirPressurePa: 170,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/reservoir-pressure-average",
  title: "Petroleum Reservoir Pressure Average Calculator",
  description:
    "Pool actual independently same-datum corrected reservoir pressure observations by measured pore volumes, not arithmetic pressure average or inferred structural datum/geodesy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "datumCorrectedPoreWeightedReservoirPressurePa",
      label: "Datum corrected pore weighted reservoir pressure pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedReservoirPatchPressuresPa:
        value.observedReservoirPatchPressuresPa as readonly number[],
      observedPatchPoreVolumesM3:
        value.observedPatchPoreVolumesM3 as readonly number[],
      callerIndependentDatumPressureCorrectionsPa:
        value.callerIndependentDatumPressureCorrectionsPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
