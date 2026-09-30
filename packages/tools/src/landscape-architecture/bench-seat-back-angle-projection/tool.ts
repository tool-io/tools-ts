import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly backLength: number;
  readonly angleFromVertical: number;
};
export type Output = {
  readonly verticalHeight: number;
  readonly horizontalSetback: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    backLength: { type: "number", minimum: 0 },
    angleFromVertical: { type: "number", minimum: 0 },
  },
  required: ["backLength", "angleFromVertical"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verticalHeight: { type: "number" },
    horizontalSetback: { type: "number" },
  },
  required: ["verticalHeight", "horizontalSetback"],
} as const;
/** Calculate bench seat back angle projection from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { backLength, angleFromVertical } = request;
  const compute = (): Output => {
    H.domain(
      backLength >= 0 &&
        angleFromVertical >= 0 &&
        angleFromVertical < Math.PI / 2,
    );
    return {
      verticalHeight: backLength * Math.cos(angleFromVertical),
      horizontalSetback: backLength * Math.sin(angleFromVertical),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { backLength: 1, angleFromVertical: 0.5235987755982988 },
  output: {
    verticalHeight: 0.8660254037844387,
    horizontalSetback: 0.49999999999999994,
  },
} satisfies ToolExample<Input, Output>;
export const benchSeatBackAngleProjectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/bench-seat-back-angle-projection",
    title: "Bench Seat Back Angle Projection Tool",
    description:
      "Calculate bench seat back angle projection from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        backLength: { type: "number", minimum: 0 },
        angleFromVertical: { type: "number", minimum: 0 },
      },
      required: ["backLength", "angleFromVertical"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verticalHeight: { type: "number" },
        horizontalSetback: { type: "number" },
      },
      required: ["verticalHeight", "horizontalSetback"],
    },
    ports: {
      inputs: [
        {
          id: "backLength",
          label: "Back Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleFromVertical",
          label: "Angle From Vertical",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "verticalHeight",
          label: "Vertical Height",
          valueType: { type: "number" },
        },
        {
          id: "horizontalSetback",
          label: "Horizontal Setback",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benchSeatBackAngleProjectionTool.execute;
export default benchSeatBackAngleProjectionTool;
