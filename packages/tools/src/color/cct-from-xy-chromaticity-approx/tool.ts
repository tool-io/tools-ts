import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, uv, positive } from "../batch-shared.js";
export type Input = Readonly<{
  readonly measuredXy: readonly number[];
  readonly callerMaximumAbsoluteN: number;
}>;
export type Output = Readonly<{ readonly mccamyApproximateCctKelvin: number }>;
const inputFields = [
  { id: "measuredXy", label: "Measured xy", kind: "numberList" },
  {
    id: "callerMaximumAbsoluteN",
    label: "Caller maximum absolute n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMaximumAbsoluteN, "callerMaximumAbsoluteN");
  uv(input.measuredXy);
  if (input.callerMaximumAbsoluteN > 10)
    simpleError("n", "Caller approximation-domain |n| bound ≤10 required.");
  const [x, y] = input.measuredXy;
  if (Math.abs(y - 0.1858) < 1e-12 && x !== 0.332)
    simpleError("xy", "CCT polynomial singular denominator.");
  if (y === 0.1858) simpleError("xy", "CCT polynomial singular denominator.");
  const n = (x - 0.332) / (y - 0.1858);
  if (Math.abs(n) > input.callerMaximumAbsoluteN)
    simpleError(
      "domain",
      "Chromaticity outside caller McCamy approximation n-range.",
    );
  const cct = -449 * n ** 3 + 3525 * n * n - 6823.3 * n + 5520.33;
  if (cct <= 0)
    simpleError(
      "cct",
      "Polynomial returned nonphysical CCT; approximation unsupported.",
    );
  return { mccamyApproximateCctKelvin: cct };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredXy: [0.332, 0.4],
  callerMaximumAbsoluteN: 2,
} satisfies Input;
export const exampleOutput = {
  mccamyApproximateCctKelvin: 5520.33,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/cct-from-xy-chromaticity-approx",
  title: "CCT From xy Chromaticity Approx",
  description:
    "Compute McCamy approximate CCT from physical xy inside explicit caller bounded polynomial n-domain; not a universal temperature for any chromaticity or standards-grade CCT/Duv validity certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "mccamyApproximateCctKelvin",
      label: "Mccamy approximate cct kelvin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredXy: value.measuredXy as readonly number[],
      callerMaximumAbsoluteN: value.callerMaximumAbsoluteN as number,
    }),
});
export const run = tool.execute;
export default tool;
