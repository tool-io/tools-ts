import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{ readonly callerJulianDate: number }>;
export type Output = Readonly<{ readonly besselianEpoch: number }>;
const inputFields = [
  { id: "callerJulianDate", label: "Caller julian date", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    besselianEpoch:
      1900 + (input.callerJulianDate - 2415020.31352) / 365.242198781,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { callerJulianDate: 2415020.31352 } satisfies Input;
export const exampleOutput = { besselianEpoch: 1900 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/besselian-epoch-offset-calculator",
  title: "Besselian Epoch from Year Start Offset Calculator",
  description:
    "Besselian epoch standard B 1900 Julian Date anchor/tropical-year constant; time scale caller established, not Julian epoch formula. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [{ id: "besselianEpoch", label: "Besselian epoch", kind: "number" }],
  calculate: (value) =>
    calculate({ callerJulianDate: value.callerJulianDate as number }),
});
export const run = tool.execute;
export default tool;
