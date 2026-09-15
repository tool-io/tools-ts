import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ principleNumber: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "principleNumber", label: "Principle number", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.principleNumber, "principle", 1, 17);
  const n = i.principleNumber;
  return {
    principleNumber: n,
    component:
      n <= 5
        ? "control-environment"
        : n <= 9
          ? "risk-assessment"
          : n <= 12
            ? "control-activities"
            : n <= 15
              ? "information-and-communication"
              : "monitoring-activities",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { principleNumber: 10 },
  output: { result: { principleNumber: 10, component: "control-activities" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "auditing/coso-2013-seventeen-principles-component-mapping-grid",
  title: "COSO 2013 Seventeen Principles Component Mapping Grid",
  description:
    "Map COSO 2013 principle numbers 1–17 to the five components; not the existing coverage checklist or a control-effectiveness assessment.",
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
