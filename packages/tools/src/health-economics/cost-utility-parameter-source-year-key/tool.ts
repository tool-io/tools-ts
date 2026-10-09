import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parameterId: string;
  readonly sourceId: string;
  readonly priceOrStudyYear: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parameterId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    priceOrStudyYear: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["parameterId", "sourceId", "priceOrStudyYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode explicit cost-utility parameter source and year metadata without retrieving or recommending parameter estimates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parameterId, sourceId, priceOrStudyYear } = request;
  const compute = (): Output => {
    H.domain(parameterId.length > 0, "parameterId");
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(priceOrStudyYear.length > 0, "priceOrStudyYear");
    return { token: JSON.stringify([parameterId, sourceId, priceOrStudyYear]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parameterId: "P17", sourceId: "S4", priceOrStudyYear: "2025" },
  output: { token: '["P17","S4","2025"]' },
} satisfies ToolExample<Input, Output>;
export const costUtilityParameterSourceYearKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/cost-utility-parameter-source-year-key",
    title: "Cost Utility Parameter Source Year Key Tool",
    description:
      "Encode explicit cost-utility parameter source and year metadata without retrieving or recommending parameter estimates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parameterId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        priceOrStudyYear: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["parameterId", "sourceId", "priceOrStudyYear"],
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
          id: "parameterId",
          label: "Parameter Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "priceOrStudyYear",
          label: "Price Or Study Year",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = costUtilityParameterSourceYearKeyTool.execute;
export default costUtilityParameterSourceYearKeyTool;
