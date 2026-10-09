import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPinChange: number;
  readonly angleFromRetreatAxisRadians: number;
};
export type Output = { readonly projectedRetreat: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPinChange: { type: "number" },
    angleFromRetreatAxisRadians: { type: "number" },
  },
  required: ["measuredPinChange", "angleFromRetreatAxisRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { projectedRetreat: { type: "number" } },
  required: ["projectedRetreat"],
} as const;
/** Project an explicit signed erosion-pin displacement onto a supplied retreat axis using a radian angle without inferring bank processes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPinChange, angleFromRetreatAxisRadians } = request;
  const compute = (): Output => {
    return {
      projectedRetreat:
        measuredPinChange * Math.cos(angleFromRetreatAxisRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredPinChange: 10, angleFromRetreatAxisRadians: 0 },
  output: { projectedRetreat: 10 },
} satisfies ToolExample<Input, Output>;
export const bankRetreatPinAngleProjectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/bank-retreat-pin-angle-projection",
    title: "Bank Retreat Pin Angle Projection Tool",
    description:
      "Project an explicit signed erosion-pin displacement onto a supplied retreat axis using a radian angle without inferring bank processes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPinChange: { type: "number" },
        angleFromRetreatAxisRadians: { type: "number" },
      },
      required: ["measuredPinChange", "angleFromRetreatAxisRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { projectedRetreat: { type: "number" } },
      required: ["projectedRetreat"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPinChange",
          label: "Measured Pin Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleFromRetreatAxisRadians",
          label: "Angle From Retreat Axis Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "projectedRetreat",
          label: "Projected Retreat",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bankRetreatPinAngleProjectionTool.execute;
export default bankRetreatPinAngleProjectionTool;
