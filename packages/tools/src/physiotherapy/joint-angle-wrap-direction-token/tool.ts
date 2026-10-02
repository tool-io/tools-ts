import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fromDegrees: number;
  readonly toDegrees: number;
  readonly clockwise: boolean;
};
export type Output = { readonly directedDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fromDegrees: { type: "number" },
    toDegrees: { type: "number" },
    clockwise: { type: "boolean" },
  },
  required: ["fromDegrees", "toDegrees", "clockwise"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { directedDegrees: { type: "number" } },
  required: ["directedDegrees"],
} as const;
/** Directed bench angle difference on a 360-degree circle under an explicit direction convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fromDegrees, toDegrees, clockwise } = request;
  const compute = (): Output => {
    const raw =
      (clockwise ? fromDegrees - toDegrees : toDegrees - fromDegrees) % 360;
    return { directedDegrees: raw < 0 ? raw + 360 : raw };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fromDegrees: 350, toDegrees: 10, clockwise: false },
  output: { directedDegrees: 20 },
} satisfies ToolExample<Input, Output>;
export const jointAngleWrapDirectionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/joint-angle-wrap-direction-token",
    title: "Joint Angle Wrap Direction Token Tool",
    description:
      "Directed bench angle difference on a 360-degree circle under an explicit direction convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fromDegrees: { type: "number" },
        toDegrees: { type: "number" },
        clockwise: { type: "boolean" },
      },
      required: ["fromDegrees", "toDegrees", "clockwise"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { directedDegrees: { type: "number" } },
      required: ["directedDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "fromDegrees",
          label: "From Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toDegrees",
          label: "To Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockwise",
          label: "Clockwise",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "directedDegrees",
          label: "Directed Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = jointAngleWrapDirectionTokenTool.execute;
export default jointAngleWrapDirectionTokenTool;
