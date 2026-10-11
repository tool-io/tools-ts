import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIntervalDeathCount: number;
  readonly actualIntervalPersonYearsLived: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIntervalDeathCount",
    label: "Actual interval death count",
    kind: "number",
  },
  {
    id: "actualIntervalPersonYearsLived",
    label: "Actual interval person years lived",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualIntervalDeathCount, "actualIntervalDeathCount");
  positive(
    input.actualIntervalPersonYearsLived,
    "actualIntervalPersonYearsLived",
  );
  return {
    value:
      input.actualIntervalDeathCount / input.actualIntervalPersonYearsLived,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualIntervalDeathCount: 2, actualIntervalPersonYearsLived: 10 },
  output: { result: { value: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/central-death-rate-mx",
  title: "Central Death Rate Mx Calculator",
  description:
    "Actualcentraldeathratemx=d/personyearsexposure,not populationfractionqx. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
