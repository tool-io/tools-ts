import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAngleDegrees: number;
  readonly secondAngleDegrees: number;
};
export type Output = { readonly shortestAbsoluteGapDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAngleDegrees: { type: "number" },
    secondAngleDegrees: { type: "number" },
  },
  required: ["firstAngleDegrees", "secondAngleDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shortestAbsoluteGapDegrees: { type: "number" } },
  required: ["shortestAbsoluteGapDegrees"],
} as const;
/** Calculate the shortest absolute planar rotation between supplied degree angles without estimating mental processing time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAngleDegrees, secondAngleDegrees } = request;
  const compute = (): Output => {
    return (() => {
      const raw = (secondAngleDegrees % 360) - (firstAngleDegrees % 360);
      return {
        shortestAbsoluteGapDegrees: Math.abs(
          ((((raw + 180) % 360) + 360) % 360) - 180,
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAngleDegrees: 350, secondAngleDegrees: 10 },
  output: { shortestAbsoluteGapDegrees: 20 },
} satisfies ToolExample<Input, Output>;
export const mentalRotationPairAngleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/mental-rotation-pair-angle-gap",
    title: "Mental Rotation Pair Angle Gap",
    description:
      "Calculate the shortest absolute planar rotation between supplied degree angles without estimating mental processing time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAngleDegrees: { type: "number" },
        secondAngleDegrees: { type: "number" },
      },
      required: ["firstAngleDegrees", "secondAngleDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shortestAbsoluteGapDegrees: { type: "number" } },
      required: ["shortestAbsoluteGapDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "firstAngleDegrees",
          label: "First Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAngleDegrees",
          label: "Second Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shortestAbsoluteGapDegrees",
          label: "Shortest Absolute Gap Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mentalRotationPairAngleGapTool.execute;
export default mentalRotationPairAngleGapTool;
