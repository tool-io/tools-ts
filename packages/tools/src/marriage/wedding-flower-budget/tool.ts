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
  readonly actualFlowerItemQuantities: readonly number[];
  readonly callerQuotedFlowerUnitCostsMinorUnits: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFlowerItemQuantities",
    label: "Actual flower item quantities",
    kind: "numberList",
  },
  {
    id: "callerQuotedFlowerUnitCostsMinorUnits",
    label: "Caller quoted flower unit costs minor units",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualFlowerItemQuantities,
    input.callerQuotedFlowerUnitCostsMinorUnits,
    "items",
  );
  input.actualFlowerItemQuantities.forEach((v) =>
    bounded(v, "quantity", 0, 1000000),
  );
  input.callerQuotedFlowerUnitCostsMinorUnits.forEach((v) =>
    money(v, "unitcost"),
  );
  return {
    conditionalQuotedInventoryCostMinorUnits: integer(
      Number(
        input.actualFlowerItemQuantities.reduce(
          (a, v, i) =>
            a +
            BigInt(v) * BigInt(input.callerQuotedFlowerUnitCostsMinorUnits[i]),
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
    actualFlowerItemQuantities: [2, 3],
    callerQuotedFlowerUnitCostsMinorUnits: [10, 20],
  },
  output: { result: { conditionalQuotedInventoryCostMinorUnits: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-flower-budget",
  title: "Wedding Flower Budget Calculator",
  description:
    "actual independently quoted flower quantities\u00d7same-currency per-unit cost. Exact safe-integer minor-unit output and integer quantities, onecurrency only; not live quote, unmodeled fees/taxes or guaranteed cost.",
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
