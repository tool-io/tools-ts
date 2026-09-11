import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFrequencyHz: number;
  readonly callerFirstOrderLowPassCornerHz: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFrequencyHz", label: "Actual frequency hz", kind: "number" },
  {
    id: "callerFirstOrderLowPassCornerHz",
    label: "Caller first order low pass corner hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualFrequencyHz, "actualFrequencyHz");
  positive(
    input.callerFirstOrderLowPassCornerHz,
    "callerFirstOrderLowPassCornerHz",
  );
  return {
    value:
      (-Math.atan(
        input.actualFrequencyHz / input.callerFirstOrderLowPassCornerHz,
      ) *
        180) /
      Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFrequencyHz: 1, callerFirstOrderLowPassCornerHz: 1 },
  output: { result: { value: -45 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/audio-crossover-phase",
  title: "Audio Crossover Phase Calculator",
  description:
    "First order low pass crossover signed phase\u2212atan(f/fc) degrees, not arbitrary Linkwitz\u2013Riley/acoustic phase or infer filter order. Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
