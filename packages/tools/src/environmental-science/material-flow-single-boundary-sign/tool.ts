import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly magnitude: number; readonly direction: string };
export type Output = { readonly signedFlow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnitude: { type: "number", minimum: 0 },
    direction: { type: "string", maxLength: 8192, enum: ["inflow", "outflow"] },
  },
  required: ["magnitude", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedFlow: { type: "number" } },
  required: ["signedFlow"],
} as const;
/** Apply the explicit inflow-positive boundary convention to one nonnegative material flow. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { magnitude, direction } = request;
  const compute = (): Output => {
    H.domain(magnitude >= 0, "magnitude");
    H.domain(["inflow", "outflow"].includes(direction), "direction");
    return { signedFlow: direction === "inflow" ? magnitude : -magnitude };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { magnitude: 12, direction: "outflow" },
  output: { signedFlow: -12 },
} satisfies ToolExample<Input, Output>;
export const materialFlowSingleBoundarySignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/material-flow-single-boundary-sign",
    title: "Material Flow Single Boundary Sign Tool",
    description:
      "Apply the explicit inflow-positive boundary convention to one nonnegative material flow.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        magnitude: { type: "number", minimum: 0 },
        direction: {
          type: "string",
          maxLength: 8192,
          enum: ["inflow", "outflow"],
        },
      },
      required: ["magnitude", "direction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedFlow: { type: "number" } },
      required: ["signedFlow"],
    },
    ports: {
      inputs: [
        {
          id: "magnitude",
          label: "Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedFlow",
          label: "Signed Flow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = materialFlowSingleBoundarySignTool.execute;
export default materialFlowSingleBoundarySignTool;
