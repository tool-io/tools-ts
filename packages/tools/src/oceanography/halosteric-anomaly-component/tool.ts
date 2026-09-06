import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly layerThicknessM: readonly number[];
  readonly callerHalineContractionPerSalinity: readonly number[];
  readonly observedSalinityAnomaly: readonly number[];
}>;
export type Output = Readonly<{ readonly signedHalostericHeightM: number }>;
const inputFields = [
  { id: "layerThicknessM", label: "Layer thickness m", kind: "numberList" },
  {
    id: "callerHalineContractionPerSalinity",
    label: "Caller haline contraction per salinity",
    kind: "numberList",
  },
  {
    id: "observedSalinityAnomaly",
    label: "Observed salinity anomaly",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerHalineContractionPerSalinity.forEach((v) =>
    positive(v, "callerHalineContractionPerSalinity"),
  );
  input.layerThicknessM.forEach((v) => nonnegative(v, "layerThicknessM"));
  aligned(
    input.layerThicknessM,
    input.callerHalineContractionPerSalinity,
    "layerThicknessM",
  );
  aligned(
    input.layerThicknessM,
    input.observedSalinityAnomaly,
    "layerThicknessM",
  );
  return {
    signedHalostericHeightM: -sum(
      input.layerThicknessM.map(
        (v, i) =>
          v *
          input.callerHalineContractionPerSalinity[i] *
          input.observedSalinityAnomaly[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerThicknessM: [10, 20],
  callerHalineContractionPerSalinity: [0.001, 0.002],
  observedSalinityAnomaly: [1, -1],
} satisfies Input;
export const exampleOutput = { signedHalostericHeightM: 0.03 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/halosteric-anomaly-component",
  title: "Halosteric Anomaly Component Calculator",
  description:
    "Small-anomaly salinity contraction integrated by layers, positive salinity reduces height; matched localβ explicit and thermal component excluded. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedHalostericHeightM",
      label: "Signed halosteric height m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      layerThicknessM: value.layerThicknessM as readonly number[],
      callerHalineContractionPerSalinity:
        value.callerHalineContractionPerSalinity as readonly number[],
      observedSalinityAnomaly:
        value.observedSalinityAnomaly as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
