import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  bounded,
  money,
  integer,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPlannedDurationDays: readonly number[];
  readonly callerQuotedDailyCostsMinorUnits: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPlannedDurationDays",
    label: "Actual planned duration days",
    kind: "numberList",
  },
  {
    id: "callerQuotedDailyCostsMinorUnits",
    label: "Caller quoted daily costs minor units",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualPlannedDurationDays,
    input.callerQuotedDailyCostsMinorUnits,
    "items",
  );
  input.actualPlannedDurationDays.forEach((v) =>
    bounded(v, "quantity", 0, 1000000),
  );
  input.callerQuotedDailyCostsMinorUnits.forEach((v) => money(v, "unitcost"));
  return {
    conditionalQuotedInventoryCostMinorUnits: integer(
      Number(
        input.actualPlannedDurationDays.reduce(
          (a, v, i) =>
            a + BigInt(v) * BigInt(input.callerQuotedDailyCostsMinorUnits[i]),
          0n,
        ),
      ),
      "totalcost",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPlannedDurationDays: [2, 3],
    callerQuotedDailyCostsMinorUnits: [10, 20],
  },
  output: { result: { conditionalQuotedInventoryCostMinorUnits: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/honeymoon-duration-cost",
  title: "Honeymoon Duration Cost Calculator",
  description:
    "actual honeymoon planned duration\u00d7independently established per-day cost. Exact safe-integer minor-unit output and integer quantities, onecurrency only; not live quote, unmodeled fees/taxes or guaranteed cost.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
