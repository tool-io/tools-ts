import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedFerroelectricGateV: readonly number[];
  readonly observedFerroelectricDrainAmps: readonly number[];
  readonly callerReferenceSwingVoltsDecade: number;
}>;
export type Output = Readonly<{
  readonly measuredFerroelectricSwingVoltsDecade: number;
  readonly belowCallerReferenceSwing: boolean;
}>;
const inputFields = [
  {
    id: "observedFerroelectricGateV",
    label: "Observed ferroelectric gate v",
    kind: "numberList",
  },
  {
    id: "observedFerroelectricDrainAmps",
    label: "Observed ferroelectric drain amps",
    kind: "numberList",
  },
  {
    id: "callerReferenceSwingVoltsDecade",
    label: "Caller reference swing volts decade",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFerroelectricDrainAmps.forEach((v) =>
    positive(v, "observedFerroelectricDrainAmps"),
  );
  positive(
    input.callerReferenceSwingVoltsDecade,
    "callerReferenceSwingVoltsDecade",
  );
  const fit = linearFit(
    input.observedFerroelectricDrainAmps.map(Math.log10),
    input.observedFerroelectricGateV,
  );
  positive(fit.slope, "positive subthreshold branch");
  return {
    measuredFerroelectricSwingVoltsDecade: fit.slope,
    belowCallerReferenceSwing:
      fit.slope < input.callerReferenceSwingVoltsDecade,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFerroelectricGateV: [0, 0.02, 0.04],
  observedFerroelectricDrainAmps: [1, 10, 100],
  callerReferenceSwingVoltsDecade: 0.06,
} satisfies Input;
export const exampleOutput = {
  measuredFerroelectricSwingVoltsDecade: 0.02,
  belowCallerReferenceSwing: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/ferroelectric-fet-subthreshold-swing-below-60",
  title:
    "Semiconductor Ferroelectric Fet Subthreshold Swing Below 60 Calculator",
  description:
    "Extract measured ferroelectric FET subthreshold swing and caller reference comparison, not theoretical capacitance swing or proof of steady-state negative capacitance.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredFerroelectricSwingVoltsDecade",
      label: "Measured ferroelectric swing volts decade",
      kind: "number",
    },
    {
      id: "belowCallerReferenceSwing",
      label: "Below caller reference swing",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFerroelectricGateV:
        value.observedFerroelectricGateV as readonly number[],
      observedFerroelectricDrainAmps:
        value.observedFerroelectricDrainAmps as readonly number[],
      callerReferenceSwingVoltsDecade:
        value.callerReferenceSwingVoltsDecade as number,
    }),
});
export const run = tool.execute;
export default tool;
