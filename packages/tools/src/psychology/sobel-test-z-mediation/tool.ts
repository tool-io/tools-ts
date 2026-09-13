import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualPathA: number;
  readonly actualPathB: number;
  readonly actualPathASe: number;
  readonly actualPathBSe: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualPathA", label: "Actual path a", kind: "number" },
  { id: "actualPathB", label: "Actual path b", kind: "number" },
  { id: "actualPathASe", label: "Actual path a se", kind: "number" },
  { id: "actualPathBSe", label: "Actual path b se", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualPathASe, "actualPathASe");
  nonnegative(input.actualPathBSe, "actualPathBSe");
  positive(
    input.actualPathB ** 2 * input.actualPathASe ** 2 +
      input.actualPathA ** 2 * input.actualPathBSe ** 2,
    "variance",
  );
  return {
    value:
      (input.actualPathA * input.actualPathB) /
      Math.sqrt(
        input.actualPathB ** 2 * input.actualPathASe ** 2 +
          input.actualPathA ** 2 * input.actualPathBSe ** 2,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPathA: 2, actualPathB: 3, actualPathASe: 1, actualPathBSe: 1 },
  output: { result: { value: 1.6641005886756874 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/sobel-test-z-mediation",
  title: "Sobel Test Z Mediation Calculator",
  description:
    "Classic Sobel first-orderdeltaZab/sqrt(b\u00b2sa\u00b2+a\u00b2sb\u00b2), zero-pathcovarianceassumption; not Aroian/Goodman variant, bootstrap or causal identification. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
