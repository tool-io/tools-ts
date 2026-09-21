import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly boundary: number;
  readonly lowerInclusive: boolean;
};
export type Output = { readonly band: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number" },
    boundary: { type: "number" },
    lowerInclusive: { type: "boolean" },
  },
  required: ["quantity", "boundary", "lowerInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { band: { type: "string", maxLength: 8192 } },
  required: ["band"],
} as const;
/** Choose one side of a supplied fee boundary, not a jurisdictional fee amount. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, boundary, lowerInclusive } = request;
  const compute = (): Output => {
    return {
      band:
        quantity < boundary || (quantity === boundary && lowerInclusive)
          ? "lower"
          : "upper",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 10, boundary: 10, lowerInclusive: true },
  output: { band: "lower" },
} satisfies ToolExample<Input, Output>;
export const feeScheduleBandBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/fee-schedule-band-boundary",
    title: "Fee Schedule Band Boundary Tool",
    description:
      "Choose one side of a supplied fee boundary, not a jurisdictional fee amount.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number" },
        boundary: { type: "number" },
        lowerInclusive: { type: "boolean" },
      },
      required: ["quantity", "boundary", "lowerInclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { band: { type: "string", maxLength: 8192 } },
      required: ["band"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundary",
          label: "Boundary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerInclusive",
          label: "Lower Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "band", label: "Band", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = feeScheduleBandBoundaryTool.execute;
export default feeScheduleBandBoundaryTool;
