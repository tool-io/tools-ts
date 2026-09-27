import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pieceAngleDegrees: number;
  readonly grainAngleDegrees: number;
  readonly suppliedBiasAngleDegrees: number;
};
export type Output = {
  readonly signedAngleGap: number;
  readonly biasResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pieceAngleDegrees: { type: "number" },
    grainAngleDegrees: { type: "number" },
    suppliedBiasAngleDegrees: { type: "number" },
  },
  required: [
    "pieceAngleDegrees",
    "grainAngleDegrees",
    "suppliedBiasAngleDegrees",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedAngleGap: { type: "number" },
    biasResidual: { type: "number" },
  },
  required: ["signedAngleGap", "biasResidual"],
} as const;
/** Compare unwrapped pattern and grain angles with an explicit bias target, without choosing a textile convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pieceAngleDegrees, grainAngleDegrees, suppliedBiasAngleDegrees } =
    request;
  const compute = (): Output => {
    return {
      signedAngleGap: pieceAngleDegrees - grainAngleDegrees,
      biasResidual:
        pieceAngleDegrees - grainAngleDegrees - suppliedBiasAngleDegrees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pieceAngleDegrees: 70,
    grainAngleDegrees: 20,
    suppliedBiasAngleDegrees: 45,
  },
  output: { signedAngleGap: 50, biasResidual: 5 },
} satisfies ToolExample<Input, Output>;
export const patternPieceBiasAngleOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/pattern-piece-bias-angle-offset",
    title: "Pattern Piece Bias Angle Offset Tool",
    description:
      "Compare unwrapped pattern and grain angles with an explicit bias target, without choosing a textile convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pieceAngleDegrees: { type: "number" },
        grainAngleDegrees: { type: "number" },
        suppliedBiasAngleDegrees: { type: "number" },
      },
      required: [
        "pieceAngleDegrees",
        "grainAngleDegrees",
        "suppliedBiasAngleDegrees",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedAngleGap: { type: "number" },
        biasResidual: { type: "number" },
      },
      required: ["signedAngleGap", "biasResidual"],
    },
    ports: {
      inputs: [
        {
          id: "pieceAngleDegrees",
          label: "Piece Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grainAngleDegrees",
          label: "Grain Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBiasAngleDegrees",
          label: "Supplied Bias Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedAngleGap",
          label: "Signed Angle Gap",
          valueType: { type: "number" },
        },
        {
          id: "biasResidual",
          label: "Bias Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = patternPieceBiasAngleOffsetTool.execute;
export default patternPieceBiasAngleOffsetTool;
