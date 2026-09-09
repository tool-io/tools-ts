import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualSeatedGuestCount: number;
  readonly callerApprovedSeatsPerTable: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSeatedGuestCount",
    label: "Actual seated guest count",
    kind: "number",
  },
  {
    id: "callerApprovedSeatsPerTable",
    label: "Caller approved seats per table",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualSeatedGuestCount, "guests", 0, 1000000);
  bounded(input.callerApprovedSeatsPerTable, "seats", 1, 1000000);
  const t = Math.ceil(
    input.actualSeatedGuestCount / input.callerApprovedSeatsPerTable,
  );
  return {
    conditionalMinimumEqualTableCount: t,
    conditionalUnusedSeatCount:
      t * input.callerApprovedSeatsPerTable - input.actualSeatedGuestCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSeatedGuestCount: 10, callerApprovedSeatsPerTable: 4 },
  output: {
    result: {
      conditionalMinimumEqualTableCount: 3,
      conditionalUnusedSeatCount: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-table-count",
  title: "Wedding Table Count Calculator",
  description:
    "Equal-capacity minimum wedding table count ceiling(guests/seats), not seating restrictions, accessible layouts or venue compliance.",
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
