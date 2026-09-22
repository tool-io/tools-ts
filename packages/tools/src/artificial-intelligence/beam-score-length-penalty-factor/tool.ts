import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logScore: number;
  readonly length: number;
  readonly alpha: number;
};
export type Output = {
  readonly penalty: number;
  readonly normalizedScore: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logScore: { type: "number" },
    length: { type: "integer", minimum: 1 },
    alpha: { type: "number", minimum: 0 },
  },
  required: ["logScore", "length", "alpha"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    penalty: { type: "number" },
    normalizedScore: { type: "number" },
  },
  required: ["penalty", "normalizedScore"],
} as const;
/** GNMT-style length penalty ((5+length)/6)^alpha; normalize a supplied cumulative log score by division. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logScore, length, alpha } = request;
  const compute = (): Output => {
    H.integer(length, 1);
    H.domain(alpha >= 0);
    return {
      penalty: ((5 + length) / 6) ** alpha,
      normalizedScore: logScore / ((5 + length) / 6) ** alpha,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logScore: -12, length: 7, alpha: 1 },
  output: { penalty: 2, normalizedScore: -6 },
} satisfies ToolExample<Input, Output>;
export const beamScoreLengthPenaltyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/beam-score-length-penalty-factor",
    title: "Beam Score Length Penalty Factor Tool",
    description:
      "GNMT-style length penalty ((5+length)/6)^alpha; normalize a supplied cumulative log score by division.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logScore: { type: "number" },
        length: { type: "integer", minimum: 1 },
        alpha: { type: "number", minimum: 0 },
      },
      required: ["logScore", "length", "alpha"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        penalty: { type: "number" },
        normalizedScore: { type: "number" },
      },
      required: ["penalty", "normalizedScore"],
    },
    ports: {
      inputs: [
        {
          id: "logScore",
          label: "Log Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "penalty", label: "Penalty", valueType: { type: "number" } },
        {
          id: "normalizedScore",
          label: "Normalized Score",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = beamScoreLengthPenaltyFactorTool.execute;
export default beamScoreLengthPenaltyFactorTool;
