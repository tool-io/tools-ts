import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, gamma } from "../batch50-shared.js";
export type Input = Readonly<{ readonly callerLemniscateScale: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerLemniscateScale",
    label: "Caller lemniscate scale",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerLemniscateScale, "callerLemniscateScale");
  return {
    value:
      (input.callerLemniscateScale * Math.sqrt(Math.PI) * gamma(0.25)) /
      gamma(0.75),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerLemniscateScale: 1 },
  output: { result: { value: 5.244115108584239 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/lemniscate-perimeter-approx",
  title: "Lemniscate Perimeter Approximation",
  description:
    "Bernoulli lemniscate full perimeter scale\u00d7\u221a\u03c0\u0393(1/4)/\u0393(3/4), scale conventionr\u00b2=a\u00b2cos2\u03b8; not ellipse perimeter.",
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
