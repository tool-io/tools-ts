import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSolidsMassFlowKgPerDay: number;
  readonly actualClarifierPlanAreaSquareMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSolidsMassFlowKgPerDay",
    label: "Actual solids mass flow kg per day",
    kind: "number",
  },
  {
    id: "actualClarifierPlanAreaSquareMeters",
    label: "Actual clarifier plan area square meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualSolidsMassFlowKgPerDay,
    "actualSolidsMassFlowKgPerDay",
  );
  positive(
    input.actualClarifierPlanAreaSquareMeters,
    "actualClarifierPlanAreaSquareMeters",
  );
  return {
    value:
      input.actualSolidsMassFlowKgPerDay /
      input.actualClarifierPlanAreaSquareMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSolidsMassFlowKgPerDay: 10,
    actualClarifierPlanAreaSquareMeters: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/clarifier-solids-loading",
  title: "Clarifier Solids Loading Calculator",
  description:
    "Clarifier solids loading mass flow/plan area, not hydraulic overflowQ/Aor settling efficiency. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
