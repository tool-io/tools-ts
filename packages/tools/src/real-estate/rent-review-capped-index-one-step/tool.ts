import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldRent: number;
  readonly indexChange: number;
  readonly floorChange: number;
  readonly capChange: number;
};
export type Output = {
  readonly appliedChange: number;
  readonly newRent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldRent: { type: "number", minimum: 0 },
    indexChange: { type: "number" },
    floorChange: { type: "number", minimum: -1 },
    capChange: { type: "number" },
  },
  required: ["oldRent", "indexChange", "floorChange", "capChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appliedChange: { type: "number" },
    newRent: { type: "number" },
  },
  required: ["appliedChange", "newRent"],
} as const;
/** Calculate rent review capped index one step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldRent, indexChange, floorChange, capChange } = request;
  const compute = (): Output => {
    H.domain(oldRent >= 0 && floorChange >= -1 && capChange >= floorChange);
    return {
      appliedChange: Math.min(capChange, Math.max(floorChange, indexChange)),
      newRent:
        oldRent * (1 + Math.min(capChange, Math.max(floorChange, indexChange))),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldRent: 1000, indexChange: 0.08, floorChange: 0, capChange: 0.05 },
  output: { appliedChange: 0.05, newRent: 1050 },
} satisfies ToolExample<Input, Output>;
export const rentReviewCappedIndexOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/rent-review-capped-index-one-step",
    title: "Rent Review Capped Index One Step Tool",
    description:
      "Calculate rent review capped index one step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldRent: { type: "number", minimum: 0 },
        indexChange: { type: "number" },
        floorChange: { type: "number", minimum: -1 },
        capChange: { type: "number" },
      },
      required: ["oldRent", "indexChange", "floorChange", "capChange"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appliedChange: { type: "number" },
        newRent: { type: "number" },
      },
      required: ["appliedChange", "newRent"],
    },
    ports: {
      inputs: [
        {
          id: "oldRent",
          label: "Old Rent",
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
          id: "floorChange",
          label: "Floor Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capChange",
          label: "Cap Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "appliedChange",
          label: "Applied Change",
          valueType: { type: "number" },
        },
        { id: "newRent", label: "New Rent", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rentReviewCappedIndexOneStepTool.execute;
export default rentReviewCappedIndexOneStepTool;
