import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedIntervals: number;
  readonly measuredLengthMm: number;
}>;
export type Output = Readonly<{ readonly perforationGauge: number }>;
const inputFields = [
  { id: "observedIntervals", label: "Observed intervals", kind: "number" },
  { id: "measuredLengthMm", label: "Measured length mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredLengthMm, "measuredLengthMm");
  nonnegative(input.observedIntervals, "observedIntervals");
  integer(input.observedIntervals, "intervals");
  return {
    perforationGauge: (20 * input.observedIntervals) / input.measuredLengthMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIntervals: 12,
  measuredLengthMm: 20,
} satisfies Input;
export const exampleOutput = { perforationGauge: 12 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/perforation-gauge-2cm",
  title: "Perforation Gauge Stamps per 2cm Calculator",
  description:
    "Count hole-to-hole intervals, not holes, on a measured straight edge; normalized per20mm. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "perforationGauge", label: "Perforation gauge", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedIntervals: value.observedIntervals as number,
      measuredLengthMm: value.measuredLengthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
