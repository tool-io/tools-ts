import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly indicatorId: string;
  readonly dimensionCode: string;
  readonly categoryCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indicatorId: { type: "string", maxLength: 8192, minLength: 1 },
    dimensionCode: { type: "string", maxLength: 8192, minLength: 1 },
    categoryCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["indicatorId", "dimensionCode", "categoryCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode explicit indicator disaggregation dimension and category identifiers without selecting a statistical standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { indicatorId, dimensionCode, categoryCode } = request;
  const compute = (): Output => {
    H.domain(indicatorId.length > 0, "indicatorId");
    H.domain(dimensionCode.length > 0, "dimensionCode");
    H.domain(categoryCode.length > 0, "categoryCode");
    return {
      token: JSON.stringify([indicatorId, dimensionCode, categoryCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { indicatorId: "I17", dimensionCode: "age", categoryCode: "A4" },
  output: { token: '["I17","age","A4"]' },
} satisfies ToolExample<Input, Output>;
export const globalGoalIndicatorDisaggregationCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/global-goal-indicator-disaggregation-code",
      title: "Global Goal Indicator Disaggregation Code Tool",
      description:
        "Encode explicit indicator disaggregation dimension and category identifiers without selecting a statistical standard.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          indicatorId: { type: "string", maxLength: 8192, minLength: 1 },
          dimensionCode: { type: "string", maxLength: 8192, minLength: 1 },
          categoryCode: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["indicatorId", "dimensionCode", "categoryCode"],
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
            id: "indicatorId",
            label: "Indicator Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "dimensionCode",
            label: "Dimension Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "categoryCode",
            label: "Category Code",
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
export const run = globalGoalIndicatorDisaggregationCodeTool.execute;
export default globalGoalIndicatorDisaggregationCodeTool;
