import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalParts: number;
  readonly nonzeroParts: number;
  readonly allowedZeroParts: number;
};
export type Output = {
  readonly zeroParts: number;
  readonly capacityRemaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalParts: { type: "integer", minimum: 0 },
    nonzeroParts: { type: "integer", minimum: 0 },
    allowedZeroParts: { type: "integer", minimum: 0 },
  },
  required: ["totalParts", "nonzeroParts", "allowedZeroParts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroParts: { type: "integer" },
    capacityRemaining: { type: "integer" },
  },
  required: ["zeroParts", "capacityRemaining"],
} as const;
/** Inspect a supplied weak composition’s part-count witness against an explicit zero-part allowance, without counting compositions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalParts, nonzeroParts, allowedZeroParts } = request;
  const compute = (): Output => {
    H.integer(totalParts, 0);
    H.integer(nonzeroParts, 0, totalParts);
    H.integer(allowedZeroParts, 0);
    return {
      zeroParts: totalParts - nonzeroParts,
      capacityRemaining: allowedZeroParts - totalParts + nonzeroParts,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalParts: 8, nonzeroParts: 5, allowedZeroParts: 4 },
  output: { zeroParts: 3, capacityRemaining: 1 },
} satisfies ToolExample<Input, Output>;
export const compositionZeroPartCapacityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/composition-zero-part-capacity",
    title: "Composition Zero Part Capacity Tool",
    description:
      "Inspect a supplied weak composition’s part-count witness against an explicit zero-part allowance, without counting compositions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalParts: { type: "integer", minimum: 0 },
        nonzeroParts: { type: "integer", minimum: 0 },
        allowedZeroParts: { type: "integer", minimum: 0 },
      },
      required: ["totalParts", "nonzeroParts", "allowedZeroParts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroParts: { type: "integer" },
        capacityRemaining: { type: "integer" },
      },
      required: ["zeroParts", "capacityRemaining"],
    },
    ports: {
      inputs: [
        {
          id: "totalParts",
          label: "Total Parts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nonzeroParts",
          label: "Nonzero Parts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allowedZeroParts",
          label: "Allowed Zero Parts",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "zeroParts",
          label: "Zero Parts",
          valueType: { type: "integer" },
        },
        {
          id: "capacityRemaining",
          label: "Capacity Remaining",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = compositionZeroPartCapacityTool.execute;
export default compositionZeroPartCapacityTool;
