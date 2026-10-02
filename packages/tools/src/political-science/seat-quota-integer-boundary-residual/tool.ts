import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly votes: number; readonly quota: number };
export type Output = {
  readonly wholeQuotas: number;
  readonly residual: number;
  readonly exactlyOnBoundary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    votes: { type: "integer", minimum: 0 },
    quota: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["votes", "quota"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholeQuotas: { type: "integer" },
    residual: { type: "number" },
    exactlyOnBoundary: { type: "boolean" },
  },
  required: ["wholeQuotas", "residual", "exactlyOnBoundary"],
} as const;
/** One supplied quota arithmetic step, without selecting an apportionment method. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { votes, quota } = request;
  const compute = (): Output => {
    H.integer(votes, 0);
    H.positive(quota);
    return {
      wholeQuotas: Math.floor(votes / quota),
      residual: votes - Math.floor(votes / quota) * quota,
      exactlyOnBoundary: votes % quota === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { votes: 100, quota: 30 },
  output: { wholeQuotas: 3, residual: 10, exactlyOnBoundary: false },
} satisfies ToolExample<Input, Output>;
export const seatQuotaIntegerBoundaryResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/seat-quota-integer-boundary-residual",
    title: "Seat Quota Integer Boundary Residual Tool",
    description:
      "One supplied quota arithmetic step, without selecting an apportionment method.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        votes: { type: "integer", minimum: 0 },
        quota: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["votes", "quota"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholeQuotas: { type: "integer" },
        residual: { type: "number" },
        exactlyOnBoundary: { type: "boolean" },
      },
      required: ["wholeQuotas", "residual", "exactlyOnBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "votes",
          label: "Votes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quota",
          label: "Quota",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wholeQuotas",
          label: "Whole Quotas",
          valueType: { type: "integer" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "exactlyOnBoundary",
          label: "Exactly On Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = seatQuotaIntegerBoundaryResidualTool.execute;
export default seatQuotaIntegerBoundaryResidualTool;
