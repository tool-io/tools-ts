import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly projectId: string;
  readonly suppliedRateText: string;
  readonly rateVintage: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRateText: { type: "string", maxLength: 8192, minLength: 1 },
    rateVintage: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["projectId", "suppliedRateText", "rateVintage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit project exchange-rate quotation and vintage without retrieving rates or choosing a conversion basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { projectId, suppliedRateText, rateVintage } = request;
  const compute = (): Output => {
    H.domain(projectId.length > 0, "projectId");
    H.domain(suppliedRateText.length > 0, "suppliedRateText");
    H.domain(rateVintage.length > 0, "rateVintage");
    return {
      token: JSON.stringify([projectId, suppliedRateText, rateVintage]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    projectId: "P17",
    suppliedRateText: "1.20 local/base",
    rateVintage: "2026-10-28",
  },
  output: { token: '["P17","1.20 local/base","2026-10-28"]' },
} satisfies ToolExample<Input, Output>;
export const crossBorderProjectExchangeRateVintageTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/cross-border-project-exchange-rate-vintage",
      title: "Cross Border Project Exchange Rate Vintage Tool",
      description:
        "Record an explicit project exchange-rate quotation and vintage without retrieving rates or choosing a conversion basis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          projectId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedRateText: { type: "string", maxLength: 8192, minLength: 1 },
          rateVintage: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["projectId", "suppliedRateText", "rateVintage"],
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
            id: "projectId",
            label: "Project Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedRateText",
            label: "Supplied Rate Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "rateVintage",
            label: "Rate Vintage",
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
export const run = crossBorderProjectExchangeRateVintageTool.execute;
export default crossBorderProjectExchangeRateVintageTool;
