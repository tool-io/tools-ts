import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blankDiameter: number;
  readonly effectiveDiameter: number;
  readonly horizontalOffset: number;
  readonly verticalOffset: number;
  readonly radialAllowance: number;
};
export type Output = {
  readonly requiredDiameter: number;
  readonly residualClearance: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankDiameter: { type: "number", minimum: 0 },
    effectiveDiameter: { type: "number", minimum: 0 },
    horizontalOffset: { type: "number" },
    verticalOffset: { type: "number" },
    radialAllowance: { type: "number", minimum: 0 },
  },
  required: [
    "blankDiameter",
    "effectiveDiameter",
    "horizontalOffset",
    "verticalOffset",
    "radialAllowance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredDiameter: { type: "number" },
    residualClearance: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["requiredDiameter", "residualClearance", "fits"],
} as const;
/** Residual circular blank clearance after supplied frame effective diameter, planar decentration and radial allowance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    blankDiameter,
    effectiveDiameter,
    horizontalOffset,
    verticalOffset,
    radialAllowance,
  } = request;
  const compute = (): Output => {
    H.domain(
      blankDiameter >= 0 && effectiveDiameter >= 0 && radialAllowance >= 0,
    );
    const requiredDiameter =
      effectiveDiameter +
      2 * Math.hypot(horizontalOffset, verticalOffset) +
      2 * radialAllowance;
    return {
      requiredDiameter,
      residualClearance: blankDiameter - requiredDiameter,
      fits: blankDiameter >= requiredDiameter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    blankDiameter: 70,
    effectiveDiameter: 50,
    horizontalOffset: 3,
    verticalOffset: 4,
    radialAllowance: 1,
  },
  output: { requiredDiameter: 62, residualClearance: 8, fits: true },
} satisfies ToolExample<Input, Output>;
export const spectacleFrameEffectiveDiameterClearanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "optometry/spectacle-frame-effective-diameter-clearance",
      title: "Spectacle Frame Effective Diameter Clearance Tool",
      description:
        "Residual circular blank clearance after supplied frame effective diameter, planar decentration and radial allowance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          blankDiameter: { type: "number", minimum: 0 },
          effectiveDiameter: { type: "number", minimum: 0 },
          horizontalOffset: { type: "number" },
          verticalOffset: { type: "number" },
          radialAllowance: { type: "number", minimum: 0 },
        },
        required: [
          "blankDiameter",
          "effectiveDiameter",
          "horizontalOffset",
          "verticalOffset",
          "radialAllowance",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requiredDiameter: { type: "number" },
          residualClearance: { type: "number" },
          fits: { type: "boolean" },
        },
        required: ["requiredDiameter", "residualClearance", "fits"],
      },
      ports: {
        inputs: [
          {
            id: "blankDiameter",
            label: "Blank Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "effectiveDiameter",
            label: "Effective Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "horizontalOffset",
            label: "Horizontal Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "verticalOffset",
            label: "Vertical Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "radialAllowance",
            label: "Radial Allowance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "requiredDiameter",
            label: "Required Diameter",
            valueType: { type: "number" },
          },
          {
            id: "residualClearance",
            label: "Residual Clearance",
            valueType: { type: "number" },
          },
          { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = spectacleFrameEffectiveDiameterClearanceTool.execute;
export default spectacleFrameEffectiveDiameterClearanceTool;
