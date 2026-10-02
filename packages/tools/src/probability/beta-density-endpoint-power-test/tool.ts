import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly shape: number };
export type Output = { readonly limit: string; readonly integrable: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shape: { type: "number", exclusiveMinimum: 0 } },
  required: ["shape"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    limit: { type: "string", maxLength: 8192 },
    integrable: { type: "boolean" },
  },
  required: ["limit", "integrable"],
} as const;
/** Classify the Beta density at zero from its positive first shape parameter, holding the second shape positive. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shape } = request;
  const compute = (): Output => {
    H.positive(shape);
    return {
      limit: shape < 1 ? "infinite" : shape === 1 ? "finite-nonzero" : "zero",
      integrable: true,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shape: 0.5 },
  output: { limit: "infinite", integrable: true },
} satisfies ToolExample<Input, Output>;
export const betaDensityEndpointPowerTestTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/beta-density-endpoint-power-test",
    title: "Beta Density Endpoint Power Test Tool",
    description:
      "Classify the Beta density at zero from its positive first shape parameter, holding the second shape positive.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shape: { type: "number", exclusiveMinimum: 0 } },
      required: ["shape"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        limit: { type: "string", maxLength: 8192 },
        integrable: { type: "boolean" },
      },
      required: ["limit", "integrable"],
    },
    ports: {
      inputs: [
        {
          id: "shape",
          label: "Shape",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "limit", label: "Limit", valueType: { type: "string" } },
        {
          id: "integrable",
          label: "Integrable",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = betaDensityEndpointPowerTestTool.execute;
export default betaDensityEndpointPowerTestTool;
