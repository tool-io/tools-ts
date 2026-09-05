import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  exactProduct,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly requiredArmorialQuarterCount: number;
  readonly callerLayoutRows: number;
  readonly callerLayoutColumns: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "requiredArmorialQuarterCount",
    label: "Required armorial quarter count",
    kind: "number",
  },
  { id: "callerLayoutRows", label: "Caller layout rows", kind: "number" },
  { id: "callerLayoutColumns", label: "Caller layout columns", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.requiredArmorialQuarterCount, "quarters", 0, 128);
  bounded(input.callerLayoutRows, "rows", 1, 64);
  bounded(input.callerLayoutColumns, "columns", 1, 64);
  const capacity = exactProduct(
    input.callerLayoutRows,
    input.callerLayoutColumns,
  );
  return {
    capacity: capacity,
    unusedQuarterSlots: capacity - input.requiredArmorialQuarterCount,
    allFit: input.requiredArmorialQuarterCount <= capacity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    requiredArmorialQuarterCount: 7,
    callerLayoutRows: 3,
    callerLayoutColumns: 3,
  },
  output: { result: { capacity: 9, unusedQuarterSlots: 2, allFit: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/quartering-count-capacity",
  title: "Marshalling Quartering Count Capacity Calculator",
  description:
    "Audit independently required quarter count against explicit grid capacity; signed shortage retained and no genealogical entitlement.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
