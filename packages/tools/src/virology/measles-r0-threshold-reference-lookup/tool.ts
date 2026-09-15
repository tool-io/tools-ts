import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, exactLookup } from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    reference: exactLookup(i.key, {
      "idealized-range":
        "For ideal homogeneous mixing and perfect durable immunity, R0=12–18 gives 1−1/R0 thresholds of 91.6667–94.4444 percent. Not an operational vaccine coverage guarantee.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "idealized-range" },
  output: {
    result: {
      reference:
        "For ideal homogeneous mixing and perfect durable immunity, R0=12–18 gives 1−1/R0 thresholds of 91.6667–94.4444 percent. Not an operational vaccine coverage guarantee.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/measles-r0-threshold-reference-lookup",
  title: "Measles R0 12-18 Herd Threshold Percent Reference Lookup",
  description:
    "Retrieve the idealized measles R0 herd-threshold range with explicit assumptions. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
