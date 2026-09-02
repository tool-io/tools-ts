import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedAirmass: number;
  readonly referenceAirmass: number;
  readonly callerBandExtinctionMagPerAirmass: number;
}>;
export type Output = Readonly<{
  readonly signedAdditionalExtinctionMagnitudes: number;
}>;
const inputFields = [
  { id: "observedAirmass", label: "Observed airmass", kind: "number" },
  { id: "referenceAirmass", label: "Reference airmass", kind: "number" },
  {
    id: "callerBandExtinctionMagPerAirmass",
    label: "Caller band extinction mag per airmass",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedAirmass, "observedAirmass");
  positive(input.referenceAirmass, "referenceAirmass");
  nonnegative(
    input.callerBandExtinctionMagPerAirmass,
    "callerBandExtinctionMagPerAirmass",
  );
  return {
    signedAdditionalExtinctionMagnitudes:
      (input.observedAirmass - input.referenceAirmass) *
      input.callerBandExtinctionMagPerAirmass,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAirmass: 2,
  referenceAirmass: 1,
  callerBandExtinctionMagPerAirmass: 0.2,
} satisfies Input;
export const exampleOutput = {
  signedAdditionalExtinctionMagnitudes: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/atmospheric-extinction-mag-airmass",
  title: "Atmospheric Extinction mag/Airmass",
  description:
    "Differential same-passband atmospheric extinction against independent reference airmass, signed differences retained. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedAdditionalExtinctionMagnitudes",
      label: "Signed additional extinction magnitudes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAirmass: value.observedAirmass as number,
      referenceAirmass: value.referenceAirmass as number,
      callerBandExtinctionMagPerAirmass:
        value.callerBandExtinctionMagPerAirmass as number,
    }),
});
export const run = tool.execute;
export default tool;
