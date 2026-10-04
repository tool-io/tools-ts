import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly angleRadians: number;
  readonly initialHeight: number;
};
export type Output = {
  readonly heightDrop: number;
  readonly finalHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    angleRadians: { type: "number" },
    initialHeight: { type: "number" },
  },
  required: ["length", "angleRadians", "initialHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightDrop: { type: "number" },
    finalHeight: { type: "number" },
  },
  required: ["heightDrop", "finalHeight"],
} as const;
/** Calculate growing tray drain angle height offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, angleRadians, initialHeight } = request;
  const compute = (): Output => {
    H.domain(length >= 0);
    return {
      heightDrop: length * Math.sin(angleRadians),
      finalHeight: initialHeight - length * Math.sin(angleRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 2, angleRadians: 0, initialHeight: 1 },
  output: { heightDrop: 0, finalHeight: 1 },
} satisfies ToolExample<Input, Output>;
export const growingTrayDrainAngleHeightOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/growing-tray-drain-angle-height-offset",
    title: "Growing Tray Drain Angle Height Offset Tool",
    description:
      "Calculate growing tray drain angle height offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", minimum: 0 },
        angleRadians: { type: "number" },
        initialHeight: { type: "number" },
      },
      required: ["length", "angleRadians", "initialHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heightDrop: { type: "number" },
        finalHeight: { type: "number" },
      },
      required: ["heightDrop", "finalHeight"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "initialHeight",
          label: "Initial Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightDrop",
          label: "Height Drop",
          valueType: { type: "number" },
        },
        {
          id: "finalHeight",
          label: "Final Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = growingTrayDrainAngleHeightOffsetTool.execute;
export default growingTrayDrainAngleHeightOffsetTool;
