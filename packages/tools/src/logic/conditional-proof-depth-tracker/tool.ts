import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly assumptionEvents: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "assumptionEvents", label: "Assumption events", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  let depth = 0,
    max = 0;
  const depths = i.assumptionEvents.map((v) => {
    pick(String(v), { "-1": 0, "0": 1, "1": 2 }, "event");
    depth += v;
    if (depth < 0)
      simpleError("events", "Cannot discharge unopened assumption.");
    max = Math.max(max, depth);
    return depth;
  });
  return {
    depthAfterEvents: depths,
    maximumDepth: max,
    undischargedDepth: depth,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { assumptionEvents: [1, 1, 0, -1, -1] },
  output: {
    result: {
      depthAfterEvents: [1, 2, 2, 1, 0],
      maximumDepth: 2,
      undischargedDepth: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/conditional-proof-depth-tracker",
  title: "Conditional Proof Assumption Discharge Depth Tracker",
  description:
    "Track nested begin(+1), neutral(0), discharge(-1) assumption events; not a validation of formulas or implication-introduction proof.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
