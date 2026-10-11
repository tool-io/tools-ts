import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly statisticId: string;
  readonly denominatorType: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statisticId: { type: "string", maxLength: 8192, minLength: 1 },
    denominatorType: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["statisticId", "denominatorType", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit proportion denominator type by source without selecting a statistical estimand. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { statisticId, denominatorType, source } = request;
  const compute = (): Output => {
    H.domain(statisticId.length > 0, "statisticId");
    H.domain(denominatorType.length > 0, "denominatorType");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([statisticId, denominatorType, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    statisticId: "S17",
    denominatorType: "eligible records",
    source: "Study A",
  },
  output: { token: '["S17","eligible records","Study A"]' },
} satisfies ToolExample<Input, Output>;
export const proportionObservationDenominatorTypeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["statistics", "mathematics"],
        keywords: ["statistics", "mathematics"],
      },
      id: "statistics/proportion-observation-denominator-type",
      title: "Proportion Observation Denominator Type",
      description:
        "Qualify an explicit proportion denominator type by source without selecting a statistical estimand.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          statisticId: { type: "string", maxLength: 8192, minLength: 1 },
          denominatorType: { type: "string", maxLength: 8192, minLength: 1 },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["statisticId", "denominatorType", "source"],
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
            id: "statisticId",
            label: "Statistic Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "denominatorType",
            label: "Denominator Type",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = proportionObservationDenominatorTypeTool.execute;
export default proportionObservationDenominatorTypeTool;
