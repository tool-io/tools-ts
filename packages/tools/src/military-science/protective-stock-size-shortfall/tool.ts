import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredCount: number;
  readonly availableCount: number;
};
export type Output = { readonly shortfall: number; readonly surplus: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCount: { type: "integer", minimum: 0 },
    availableCount: { type: "integer", minimum: 0 },
  },
  required: ["requiredCount", "availableCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shortfall: { type: "integer" }, surplus: { type: "integer" } },
  required: ["shortfall", "surplus"],
} as const;
/** Compare administrative protective-stock counts for one explicitly specified size without advising equipment use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredCount, availableCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(requiredCount) &&
        requiredCount >= 0 &&
        requiredCount <= Number.MAX_SAFE_INTEGER,
      "requiredCount",
    ),
      requiredCount);
    (H.domain(
      Number.isSafeInteger(availableCount) &&
        availableCount >= 0 &&
        availableCount <= Number.MAX_SAFE_INTEGER,
      "availableCount",
    ),
      availableCount);
    return {
      shortfall: Math.max(0, requiredCount - availableCount),
      surplus: Math.max(0, availableCount - requiredCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredCount: 25, availableCount: 18 },
  output: { shortfall: 7, surplus: 0 },
} satisfies ToolExample<Input, Output>;
export const protectiveStockSizeShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/protective-stock-size-shortfall",
    title: "Protective Stock Size Shortfall Tool",
    description:
      "Compare administrative protective-stock counts for one explicitly specified size without advising equipment use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCount: { type: "integer", minimum: 0 },
        availableCount: { type: "integer", minimum: 0 },
      },
      required: ["requiredCount", "availableCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "integer" },
        surplus: { type: "integer" },
      },
      required: ["shortfall", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "requiredCount",
          label: "Required Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "availableCount",
          label: "Available Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
        { id: "surplus", label: "Surplus", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = protectiveStockSizeShortfallTool.execute;
export default protectiveStockSizeShortfallTool;
