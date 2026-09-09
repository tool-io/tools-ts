import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualGuestCount: number;
  readonly actualOtherOccupantCount: number;
  readonly callerAuthorityApplicableVenueOccupantCap: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualGuestCount", label: "Actual guest count", kind: "number" },
  {
    id: "actualOtherOccupantCount",
    label: "Actual other occupant count",
    kind: "number",
  },
  {
    id: "callerAuthorityApplicableVenueOccupantCap",
    label: "Caller authority applicable venue occupant cap",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.actualGuestCount,
    input.actualOtherOccupantCount,
    input.callerAuthorityApplicableVenueOccupantCap,
  ].forEach((v) => bounded(v, "occupants", 0, 1000000));
  return {
    observedTotalOccupants:
      input.actualGuestCount + input.actualOtherOccupantCount,
    signedAuthorityCapRemainingOccupants:
      input.callerAuthorityApplicableVenueOccupantCap -
      input.actualGuestCount -
      input.actualOtherOccupantCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualGuestCount: 100,
    actualOtherOccupantCount: 10,
    callerAuthorityApplicableVenueOccupantCap: 105,
  },
  output: {
    result: {
      observedTotalOccupants: 110,
      signedAuthorityCapRemainingOccupants: -5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-venue-capacity-checker",
  title: "Wedding Venue Capacity Checker",
  description:
    "Actual guests+staff/otheroccupants versus authority-established actual venue/layout cap, not derive fire-code capacity or certify legal admission/safety.",
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
