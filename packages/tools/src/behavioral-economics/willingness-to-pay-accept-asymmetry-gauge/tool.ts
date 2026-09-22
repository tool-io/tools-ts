import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly pay: number; readonly accept: number };
export type Output = {
  readonly normalizedGap: number;
  readonly midpoint: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pay: { type: "number", minimum: 0 },
    accept: { type: "number", minimum: 0 },
  },
  required: ["pay", "accept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedGap: { type: "number" },
    midpoint: { type: "number" },
  },
  required: ["normalizedGap", "midpoint"],
} as const;
/** Calculate willingness to pay accept asymmetry gauge from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pay, accept } = request;
  const compute = (): Output => {
    H.domain(pay >= 0 && accept >= 0 && pay + accept > 0);
    return {
      normalizedGap: (2 * (accept - pay)) / (accept + pay),
      midpoint: (accept + pay) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pay: 20, accept: 30 },
  output: { normalizedGap: 0.4, midpoint: 25 },
} satisfies ToolExample<Input, Output>;
export const willingnessToPayAcceptAsymmetryGaugeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-economics/willingness-to-pay-accept-asymmetry-gauge",
      title: "Willingness To Pay Accept Asymmetry Gauge Tool",
      description:
        "Calculate willingness to pay accept asymmetry gauge from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pay: { type: "number", minimum: 0 },
          accept: { type: "number", minimum: 0 },
        },
        required: ["pay", "accept"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalizedGap: { type: "number" },
          midpoint: { type: "number" },
        },
        required: ["normalizedGap", "midpoint"],
      },
      ports: {
        inputs: [
          {
            id: "pay",
            label: "Pay",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "accept",
            label: "Accept",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "normalizedGap",
            label: "Normalized Gap",
            valueType: { type: "number" },
          },
          { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = willingnessToPayAcceptAsymmetryGaugeTool.execute;
export default willingnessToPayAcceptAsymmetryGaugeTool;
