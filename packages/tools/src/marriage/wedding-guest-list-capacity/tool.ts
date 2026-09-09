import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualConfirmedGuestCount: number;
  readonly callerIndependentlyEstablishedGuestListCapacity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualConfirmedGuestCount",
    label: "Actual confirmed guest count",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedGuestListCapacity",
    label: "Caller independently established guest list capacity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualConfirmedGuestCount, "guests", 0, 1000000);
  bounded(
    input.callerIndependentlyEstablishedGuestListCapacity,
    "capacity",
    0,
    1000000,
  );
  return {
    signedGuestListRemainingPlaces:
      input.callerIndependentlyEstablishedGuestListCapacity -
      input.actualConfirmedGuestCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualConfirmedGuestCount: 10,
    callerIndependentlyEstablishedGuestListCapacity: 8,
  },
  output: { result: { signedGuestListRemainingPlaces: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-guest-list-capacity",
  title: "Wedding Guest List Capacity Calculator",
  description:
    "Actual confirmed guest count versus caller guest-list cap, signed excess retained; not venue/fire capacity or admission permission.",
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
