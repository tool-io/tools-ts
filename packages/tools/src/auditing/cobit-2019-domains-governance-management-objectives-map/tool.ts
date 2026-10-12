import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, exactLookup } from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    reference: exactLookup(i.key, {
      EDM: "Evaluate, Direct and Monitor — governance.",
      APO: "Align, Plan and Organize — management.",
      BAI: "Build, Acquire and Implement — management.",
      DSS: "Deliver, Service and Support — management.",
      MEA: "Monitor, Evaluate and Assess — management.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "EDM" },
  output: {
    result: { reference: "Evaluate, Direct and Monitor — governance." },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "auditing/cobit-2019-domains-governance-management-objectives-map",
  title: "COBIT 2019 Domains Governance Management Objectives Map",
  description:
    "Map COBIT 2019 domain abbreviations, not control effectiveness or conformance. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
