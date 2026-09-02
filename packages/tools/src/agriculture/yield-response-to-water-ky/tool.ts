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
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedActualEtMm: number;
  readonly callerMatchedMaximumEtMm: number;
  readonly observedActualYieldKg: number;
  readonly callerMatchedMaximumYieldKg: number;
}>;
export type Output = Readonly<{
  readonly observedWaterYieldResponseKy: number;
}>;
const inputFields = [
  { id: "observedActualEtMm", label: "Observed actual et mm", kind: "number" },
  {
    id: "callerMatchedMaximumEtMm",
    label: "Caller matched maximum et mm",
    kind: "number",
  },
  {
    id: "observedActualYieldKg",
    label: "Observed actual yield kg",
    kind: "number",
  },
  {
    id: "callerMatchedMaximumYieldKg",
    label: "Caller matched maximum yield kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMatchedMaximumEtMm, "callerMatchedMaximumEtMm");
  positive(input.callerMatchedMaximumYieldKg, "callerMatchedMaximumYieldKg");
  nonnegative(input.observedActualEtMm, "observedActualEtMm");
  nonnegative(input.observedActualYieldKg, "observedActualYieldKg");
  const deficit = 1 - input.observedActualEtMm / input.callerMatchedMaximumEtMm;
  if (deficit <= 0)
    simpleError("ET", "Positive independent reference ET deficit required.");
  return {
    observedWaterYieldResponseKy:
      (1 - input.observedActualYieldKg / input.callerMatchedMaximumYieldKg) /
      deficit,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedActualEtMm: 80,
  callerMatchedMaximumEtMm: 100,
  observedActualYieldKg: 70,
  callerMatchedMaximumYieldKg: 100,
} satisfies Input;
export const exampleOutput = {
  observedWaterYieldResponseKy: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/yield-response-to-water-ky",
  title: "Agriculture Yield Response To Water Ky Calculator",
  description:
    "Infer actual Ky=(1−Ya/Ym)/(1−ETa/ETm) from independently matched references; negative yield gain retained, not causal efficacy. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWaterYieldResponseKy",
      label: "Observed water yield response ky",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedActualEtMm: value.observedActualEtMm as number,
      callerMatchedMaximumEtMm: value.callerMatchedMaximumEtMm as number,
      observedActualYieldKg: value.observedActualYieldKg as number,
      callerMatchedMaximumYieldKg: value.callerMatchedMaximumYieldKg as number,
    }),
});
export const run = tool.execute;
export default tool;
