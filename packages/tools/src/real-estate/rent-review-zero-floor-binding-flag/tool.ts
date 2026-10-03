import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentRent: number;
  readonly indexChange: number;
  readonly zeroFloor: boolean;
};
export type Output = {
  readonly unflooredRent: number;
  readonly reviewedRent: number;
  readonly floorBinds: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentRent: { type: "number", minimum: 0 },
    indexChange: { type: "number", minimum: -1 },
    zeroFloor: { type: "boolean" },
  },
  required: ["currentRent", "indexChange", "zeroFloor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unflooredRent: { type: "number" },
    reviewedRent: { type: "number" },
    floorBinds: { type: "boolean" },
  },
  required: ["unflooredRent", "reviewedRent", "floorBinds"],
} as const;
/** Apply a caller-selected zero floor to the rate of rent change, not to the rent amount. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentRent, indexChange, zeroFloor } = request;
  const compute = (): Output => {
    H.domain(currentRent >= 0 && indexChange >= -1);
    return {
      unflooredRent: currentRent * (1 + indexChange),
      reviewedRent:
        currentRent *
        (1 + (zeroFloor ? Math.max(0, indexChange) : indexChange)),
      floorBinds: zeroFloor && indexChange < 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentRent: 1000, indexChange: -0.05, zeroFloor: true },
  output: { unflooredRent: 950, reviewedRent: 1000, floorBinds: true },
} satisfies ToolExample<Input, Output>;
export const rentReviewZeroFloorBindingFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/rent-review-zero-floor-binding-flag",
    title: "Rent Review Zero Floor Binding Flag Tool",
    description:
      "Apply a caller-selected zero floor to the rate of rent change, not to the rent amount.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentRent: { type: "number", minimum: 0 },
        indexChange: { type: "number", minimum: -1 },
        zeroFloor: { type: "boolean" },
      },
      required: ["currentRent", "indexChange", "zeroFloor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unflooredRent: { type: "number" },
        reviewedRent: { type: "number" },
        floorBinds: { type: "boolean" },
      },
      required: ["unflooredRent", "reviewedRent", "floorBinds"],
    },
    ports: {
      inputs: [
        {
          id: "currentRent",
          label: "Current Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "indexChange",
          label: "Index Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroFloor",
          label: "Zero Floor",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "unflooredRent",
          label: "Unfloored Rent",
          valueType: { type: "number" },
        },
        {
          id: "reviewedRent",
          label: "Reviewed Rent",
          valueType: { type: "number" },
        },
        {
          id: "floorBinds",
          label: "Floor Binds",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = rentReviewZeroFloorBindingFlagTool.execute;
export default rentReviewZeroFloorBindingFlagTool;
