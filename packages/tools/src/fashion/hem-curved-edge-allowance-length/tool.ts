import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seamlineRadius: number;
  readonly signedRadialAllowance: number;
  readonly arcAngleRadians: number;
};
export type Output = {
  readonly cutlineRadius: number;
  readonly cutlineArcLength: number;
  readonly lengthDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seamlineRadius: { type: "number", minimum: 0 },
    signedRadialAllowance: { type: "number" },
    arcAngleRadians: { type: "number", minimum: 0 },
  },
  required: ["seamlineRadius", "signedRadialAllowance", "arcAngleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cutlineRadius: { type: "number" },
    cutlineArcLength: { type: "number" },
    lengthDifference: { type: "number" },
  },
  required: ["cutlineRadius", "cutlineArcLength", "lengthDifference"],
} as const;
/** Calculate a circular hem offset arc length from explicit radius, signed allowance, and angle without approximating a general garment curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seamlineRadius, signedRadialAllowance, arcAngleRadians } = request;
  const compute = (): Output => {
    H.domain(
      seamlineRadius >= 0 && seamlineRadius + signedRadialAllowance >= 0,
      "seamlineRadius",
    );
    H.domain(arcAngleRadians >= 0, "arcAngleRadians");
    return {
      cutlineRadius: seamlineRadius + signedRadialAllowance,
      cutlineArcLength:
        (seamlineRadius + signedRadialAllowance) * arcAngleRadians,
      lengthDifference: signedRadialAllowance * arcAngleRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seamlineRadius: 10, signedRadialAllowance: 2, arcAngleRadians: 1.5 },
  output: { cutlineRadius: 12, cutlineArcLength: 18, lengthDifference: 3 },
} satisfies ToolExample<Input, Output>;
export const hemCurvedEdgeAllowanceLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["fashion", "arts and design"],
      keywords: ["fashion", "arts and design"],
    },
    id: "fashion/hem-curved-edge-allowance-length",
    title: "Hem Curved Edge Allowance Length",
    description:
      "Calculate a circular hem offset arc length from explicit radius, signed allowance, and angle without approximating a general garment curve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seamlineRadius: { type: "number", minimum: 0 },
        signedRadialAllowance: { type: "number" },
        arcAngleRadians: { type: "number", minimum: 0 },
      },
      required: ["seamlineRadius", "signedRadialAllowance", "arcAngleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cutlineRadius: { type: "number" },
        cutlineArcLength: { type: "number" },
        lengthDifference: { type: "number" },
      },
      required: ["cutlineRadius", "cutlineArcLength", "lengthDifference"],
    },
    ports: {
      inputs: [
        {
          id: "seamlineRadius",
          label: "Seamline Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedRadialAllowance",
          label: "Signed Radial Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "arcAngleRadians",
          label: "Arc Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cutlineRadius",
          label: "Cutline Radius",
          valueType: { type: "number" },
        },
        {
          id: "cutlineArcLength",
          label: "Cutline Arc Length",
          valueType: { type: "number" },
        },
        {
          id: "lengthDifference",
          label: "Length Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hemCurvedEdgeAllowanceLengthTool.execute;
export default hemCurvedEdgeAllowanceLengthTool;
