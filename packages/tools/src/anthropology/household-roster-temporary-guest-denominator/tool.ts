import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residents: number;
  readonly temporaryGuests: number;
  readonly includeGuests: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly guestShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residents: { type: "integer", minimum: 1 },
    temporaryGuests: { type: "integer", minimum: 0 },
    includeGuests: { type: "boolean" },
  },
  required: ["residents", "temporaryGuests", "includeGuests"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    guestShare: { type: "number" },
  },
  required: ["denominator", "guestShare"],
} as const;
/** Calculate household roster temporary guest denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residents, temporaryGuests, includeGuests } = request;
  const compute = (): Output => {
    H.integer(residents, 1);
    H.integer(temporaryGuests, 0);
    return {
      denominator: residents + (includeGuests ? temporaryGuests : 0),
      guestShare: temporaryGuests / (residents + temporaryGuests),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { residents: 4, temporaryGuests: 2, includeGuests: false },
  output: { denominator: 4, guestShare: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const householdRosterTemporaryGuestDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anthropology/household-roster-temporary-guest-denominator",
      title: "Household Roster Temporary Guest Denominator Tool",
      description:
        "Calculate household roster temporary guest denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residents: { type: "integer", minimum: 1 },
          temporaryGuests: { type: "integer", minimum: 0 },
          includeGuests: { type: "boolean" },
        },
        required: ["residents", "temporaryGuests", "includeGuests"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          guestShare: { type: "number" },
        },
        required: ["denominator", "guestShare"],
      },
      ports: {
        inputs: [
          {
            id: "residents",
            label: "Residents",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "temporaryGuests",
            label: "Temporary Guests",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeGuests",
            label: "Include Guests",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "guestShare",
            label: "Guest Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = householdRosterTemporaryGuestDenominatorTool.execute;
export default householdRosterTemporaryGuestDenominatorTool;
