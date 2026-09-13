import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  bounded,
  sum,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualWho5ItemCodes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualWho5ItemCodes",
    label: "Actual who5 item codes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualWho5ItemCodes.length)
    simpleError("actualWho5ItemCodes", "Actual nonempty observations.");
  input.actualWho5ItemCodes.forEach((v) =>
    nonnegative(v, "actualWho5ItemCodes"),
  );
  if (input.actualWho5ItemCodes.length !== 5)
    simpleError("WHO5", "Exactly five independently assessed items.");
  input.actualWho5ItemCodes.forEach((v) => bounded(v, "code", 0, 5));
  return { value: 4 * sum(input.actualWho5ItemCodes) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualWho5ItemCodes: [1, 2, 3, 4, 5] },
  output: { result: { value: 60 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/who5-wellbeing-percent-of-max",
  title: "WHO-5 Wellbeing Percent of Max Calculator",
  description:
    "WHO5five independently assigned0\u20135items, rawsum\u00d74percentage of maximum100; does not infer diagnosis or thresholds. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
