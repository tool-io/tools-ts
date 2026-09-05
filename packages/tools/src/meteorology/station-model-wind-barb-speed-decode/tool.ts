import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedPennants: number;
  readonly observedFullBarbs: number;
  readonly observedHalfBarbs: number;
  readonly observedCalmCircle: boolean;
}>;
export type Output = Readonly<{ readonly decodedWindKnots: number }>;
const inputFields = [
  { id: "observedPennants", label: "Observed pennants", kind: "number" },
  { id: "observedFullBarbs", label: "Observed full barbs", kind: "number" },
  { id: "observedHalfBarbs", label: "Observed half barbs", kind: "number" },
  { id: "observedCalmCircle", label: "Observed calm circle", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedPennants, "observedPennants");
  nonnegative(input.observedFullBarbs, "observedFullBarbs");
  nonnegative(input.observedHalfBarbs, "observedHalfBarbs");
  [
    input.observedPennants,
    input.observedFullBarbs,
    input.observedHalfBarbs,
  ].forEach((v) => bounded(v, "symbol count", 0, 20));
  if (
    input.observedHalfBarbs > 1 ||
    (input.observedCalmCircle &&
      input.observedPennants +
        input.observedFullBarbs +
        input.observedHalfBarbs >
        0)
  )
    simpleError(
      "symbols",
      "At most one half barb, calm circle excludes all flags.",
    );
  return {
    decodedWindKnots:
      50 * input.observedPennants +
      10 * input.observedFullBarbs +
      5 * input.observedHalfBarbs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPennants: 1,
  observedFullBarbs: 2,
  observedHalfBarbs: 1,
  observedCalmCircle: false,
} satisfies Input;
export const exampleOutput = { decodedWindKnots: 75 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/station-model-wind-barb-speed-decode",
  title: "Station Model Wind Barb Speed Decoder",
  description:
    "Decode independently observed conventional 50/10/5knot symbols; no wind direction, OCR or different unit convention inferred. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "decodedWindKnots", label: "Decoded wind knots", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedPennants: value.observedPennants as number,
      observedFullBarbs: value.observedFullBarbs as number,
      observedHalfBarbs: value.observedHalfBarbs as number,
      observedCalmCircle: value.observedCalmCircle as boolean,
    }),
});
export const run = tool.execute;
export default tool;
