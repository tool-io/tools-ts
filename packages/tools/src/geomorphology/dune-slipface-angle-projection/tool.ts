import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slopeLength: number;
  readonly angleRadians: number;
};
export type Output = {
  readonly horizontalRun: number;
  readonly verticalRise: number;
  readonly slope: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slopeLength: { type: "number", minimum: 0 },
    angleRadians: { type: "number" },
  },
  required: ["slopeLength", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalRun: { type: "number" },
    verticalRise: { type: "number" },
    slope: { type: "number" },
  },
  required: ["horizontalRun", "verticalRise", "slope"],
} as const;
/** Planar slipface projection in radians; signed angle preserves face orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slopeLength, angleRadians } = request;
  const compute = (): Output => {
    H.domain(
      slopeLength >= 0 &&
        angleRadians > -Math.PI / 2 &&
        angleRadians < Math.PI / 2,
    );
    return {
      horizontalRun: slopeLength * Math.cos(angleRadians),
      verticalRise: slopeLength * Math.sin(angleRadians),
      slope: Math.tan(angleRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slopeLength: 10, angleRadians: 0.5235987755982988 },
  output: {
    horizontalRun: 8.660254037844387,
    verticalRise: 4.999999999999999,
    slope: 0.5773502691896257,
  },
} satisfies ToolExample<Input, Output>;
export const duneSlipfaceAngleProjectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/dune-slipface-angle-projection",
    title: "Dune Slipface Angle Projection Tool",
    description:
      "Planar slipface projection in radians; signed angle preserves face orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slopeLength: { type: "number", minimum: 0 },
        angleRadians: { type: "number" },
      },
      required: ["slopeLength", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalRun: { type: "number" },
        verticalRise: { type: "number" },
        slope: { type: "number" },
      },
      required: ["horizontalRun", "verticalRise", "slope"],
    },
    ports: {
      inputs: [
        {
          id: "slopeLength",
          label: "Slope Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        {
          id: "horizontalRun",
          label: "Horizontal Run",
          valueType: { type: "number" },
        },
        {
          id: "verticalRise",
          label: "Vertical Rise",
          valueType: { type: "number" },
        },
        { id: "slope", label: "Slope", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = duneSlipfaceAngleProjectionTool.execute;
export default duneSlipfaceAngleProjectionTool;
