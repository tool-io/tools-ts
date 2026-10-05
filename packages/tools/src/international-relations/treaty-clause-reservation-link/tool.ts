import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly treatyId: string;
  readonly clauseId: string;
  readonly reservationId: string;
};
export type Output = { readonly linkToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treatyId: { type: "string", maxLength: 8192 },
    clauseId: { type: "string", maxLength: 8192 },
    reservationId: { type: "string", maxLength: 8192 },
  },
  required: ["treatyId", "clauseId", "reservationId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { linkToken: { type: "string", maxLength: 8192 } },
  required: ["linkToken"],
} as const;
/** Encode an explicitly supplied treaty/clause/reservation association without assessing the reservation's validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { treatyId, clauseId, reservationId } = request;
  const compute = (): Output => {
    H.domain(
      treatyId.length > 0 && clauseId.length > 0 && reservationId.length > 0,
      "treatyId",
    );
    return { linkToken: JSON.stringify([treatyId, clauseId, reservationId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { treatyId: "T7", clauseId: "Art-4", reservationId: "R2" },
  output: { linkToken: '["T7","Art-4","R2"]' },
} satisfies ToolExample<Input, Output>;
export const treatyClauseReservationLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/treaty-clause-reservation-link",
    title: "Treaty Clause Reservation Link Tool",
    description:
      "Encode an explicitly supplied treaty/clause/reservation association without assessing the reservation's validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        treatyId: { type: "string", maxLength: 8192 },
        clauseId: { type: "string", maxLength: 8192 },
        reservationId: { type: "string", maxLength: 8192 },
      },
      required: ["treatyId", "clauseId", "reservationId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { linkToken: { type: "string", maxLength: 8192 } },
      required: ["linkToken"],
    },
    ports: {
      inputs: [
        {
          id: "treatyId",
          label: "Treaty Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "clauseId",
          label: "Clause Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reservationId",
          label: "Reservation Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "linkToken", label: "Link Token", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = treatyClauseReservationLinkTool.execute;
export default treatyClauseReservationLinkTool;
