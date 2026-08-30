import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly realValue: number;
  readonly maximumDenominator: number;
}>;
export type Output = Readonly<{
  readonly bestNumerator: number;
  readonly bestDenominator: number;
  readonly absoluteApproximationError: number;
}>;
const inputFields = [
  { id: "realValue", label: "Real value", kind: "number" },
  { id: "maximumDenominator", label: "Maximum denominator", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const max = bounded(
      input.maximumDenominator,
      "maximumDenominator",
      1,
      100000,
    ),
    x = input.realValue;
  if (Math.abs(x) * max > Number.MAX_SAFE_INTEGER / 2)
    simpleError(
      "realValue",
      "Exactly representable bounded numerator search required.",
    );
  let p = Math.round(x),
    q = 1,
    best = Math.abs(x - p);
  for (let d = 2; d <= max; d++) {
    const n = Math.round(x * d),
      err = Math.abs(x - n / d);
    if (err < best) {
      p = n;
      q = d;
      best = err;
    }
  }
  return {
    bestNumerator: p,
    bestDenominator: q,
    absoluteApproximationError: best,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  realValue: 3.141592653589793,
  maximumDenominator: 10,
} satisfies Input;
export const exampleOutput = {
  bestNumerator: 22,
  bestDenominator: 7,
  absoluteApproximationError: 0.0012644892673496777,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/best-rational-approximation",
  title: "Best Rational Approximation Calculator",
  description:
    "Find closest rational to supplied binary floating-point value over denominators 1..caller bound, with earliest denominator ties; unlike continued fractions, checks global finite denominator inventory, not irrationality proof.",
  inputs: inputFields,
  outputs: [
    { id: "bestNumerator", label: "Best numerator", kind: "number" },
    { id: "bestDenominator", label: "Best denominator", kind: "number" },
    {
      id: "absoluteApproximationError",
      label: "Absolute approximation error",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      realValue: value.realValue as number,
      maximumDenominator: value.maximumDenominator as number,
    }),
});
export const run = tool.execute;
export default tool;
