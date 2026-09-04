import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedBenkelmanDialInitialMm: readonly number[];
  readonly observedBenkelmanDialFinalMm: readonly number[];
  readonly callerBeamLeverRatio: number;
  readonly callerIndependentTemperatureCorrectionsMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly correctedObservedReboundDeflectionsMm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBenkelmanDialInitialMm",
    label: "Observed benkelman dial initial mm",
    kind: "numberList",
  },
  {
    id: "observedBenkelmanDialFinalMm",
    label: "Observed benkelman dial final mm",
    kind: "numberList",
  },
  {
    id: "callerBeamLeverRatio",
    label: "Caller beam lever ratio",
    kind: "number",
  },
  {
    id: "callerIndependentTemperatureCorrectionsMm",
    label: "Caller independent temperature corrections mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerBeamLeverRatio, "callerBeamLeverRatio");
  aligned(
    input.observedBenkelmanDialInitialMm,
    input.observedBenkelmanDialFinalMm,
    "observedBenkelmanDialInitialMm",
  );
  aligned(
    input.observedBenkelmanDialInitialMm,
    input.callerIndependentTemperatureCorrectionsMm,
    "observedBenkelmanDialInitialMm",
  );
  return {
    correctedObservedReboundDeflectionsMm:
      input.observedBenkelmanDialInitialMm.map(
        (v, i) =>
          (v - input.observedBenkelmanDialFinalMm[i]) *
            input.callerBeamLeverRatio +
          input.callerIndependentTemperatureCorrectionsMm[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBenkelmanDialInitialMm: [1, 2],
  observedBenkelmanDialFinalMm: [0.5, 1],
  callerBeamLeverRatio: 2,
  callerIndependentTemperatureCorrectionsMm: [0.1, -0.1],
} satisfies Input;
export const exampleOutput = {
  correctedObservedReboundDeflectionsMm: [1.1, 1.9],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/pavement-deflection-benkelman",
  title: "Benkelman Pavement Deflection Calculator",
  description:
    "Actual Benkelman lever/dial rebound with independent temperature corrections, signed rebound retained, no pavement acceptance threshold. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedObservedReboundDeflectionsMm",
      label: "Corrected observed rebound deflections mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBenkelmanDialInitialMm:
        value.observedBenkelmanDialInitialMm as readonly number[],
      observedBenkelmanDialFinalMm:
        value.observedBenkelmanDialFinalMm as readonly number[],
      callerBeamLeverRatio: value.callerBeamLeverRatio as number,
      callerIndependentTemperatureCorrectionsMm:
        value.callerIndependentTemperatureCorrectionsMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
