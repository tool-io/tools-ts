import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly periodId: string;
  readonly suppliedCarryoverCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    periodId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCarryoverCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "periodId", "suppliedCarryoverCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit crossover-period carryover assertion without estimating carryover or selecting a washout period. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, periodId, suppliedCarryoverCode } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(periodId.length > 0, "periodId");
    H.domain(suppliedCarryoverCode.length > 0, "suppliedCarryoverCode");
    return {
      token: JSON.stringify([participantId, periodId, suppliedCarryoverCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    periodId: "period 2",
    suppliedCarryoverCode: "possible",
  },
  output: { token: '["P17","period 2","possible"]' },
} satisfies ToolExample<Input, Output>;
export const crossoverPeriodCarryoverTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/crossover-period-carryover-tag",
    title: "Crossover Period Carryover Tag Tool",
    description:
      "Preserve an explicit crossover-period carryover assertion without estimating carryover or selecting a washout period.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        periodId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCarryoverCode: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["participantId", "periodId", "suppliedCarryoverCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "participantId",
          label: "Participant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "periodId",
          label: "Period Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCarryoverCode",
          label: "Supplied Carryover Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = crossoverPeriodCarryoverTagTool.execute;
export default crossoverPeriodCarryoverTagTool;
