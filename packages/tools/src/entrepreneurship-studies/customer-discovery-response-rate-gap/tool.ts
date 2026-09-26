import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responses: number;
  readonly invitations: number;
  readonly referenceRate: number;
};
export type Output = { readonly rate: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responses: { type: "integer", minimum: 0 },
    invitations: { type: "integer", minimum: 1 },
    referenceRate: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["responses", "invitations", "referenceRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rate: { type: "number" }, gap: { type: "number" } },
  required: ["rate", "gap"],
} as const;
/** Calculate customer discovery response rate gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responses, invitations, referenceRate } = request;
  const compute = (): Output => {
    H.integer(invitations, 1);
    H.integer(responses, 0, invitations);
    H.probability(referenceRate);
    return {
      rate: responses / invitations,
      gap: responses / invitations - referenceRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responses: 30, invitations: 100, referenceRate: 0.25 },
  output: { rate: 0.3, gap: 0.04999999999999999 },
} satisfies ToolExample<Input, Output>;
export const customerDiscoveryResponseRateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/customer-discovery-response-rate-gap",
    title: "Customer Discovery Response Rate Gap Tool",
    description:
      "Calculate customer discovery response rate gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responses: { type: "integer", minimum: 0 },
        invitations: { type: "integer", minimum: 1 },
        referenceRate: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["responses", "invitations", "referenceRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rate: { type: "number" }, gap: { type: "number" } },
      required: ["rate", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "responses",
          label: "Responses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "invitations",
          label: "Invitations",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceRate",
          label: "Reference Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rate", label: "Rate", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = customerDiscoveryResponseRateGapTool.execute;
export default customerDiscoveryResponseRateGapTool;
