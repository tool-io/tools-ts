import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly radius: number; readonly angleRadians: number };
export type Output = {
  readonly arcLength: number;
  readonly chordLength: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    angleRadians: { type: "number" },
  },
  required: ["radius", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arcLength: { type: "number" },
    chordLength: { type: "number" },
    excess: { type: "number" },
  },
  required: ["arcLength", "chordLength", "excess"],
} as const;
/** Calculate arch model segment curve chord gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, angleRadians } = request;
  const compute = (): Output => {
    H.domain(radius >= 0 && Math.abs(angleRadians) <= 2 * Math.PI);
    return {
      arcLength: radius * Math.abs(angleRadians),
      chordLength: 2 * radius * Math.sin(Math.abs(angleRadians) / 2),
      excess:
        radius * Math.abs(angleRadians) -
        2 * radius * Math.sin(Math.abs(angleRadians) / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 10, angleRadians: 3.141592653589793 },
  output: {
    arcLength: 31.41592653589793,
    chordLength: 20,
    excess: 11.415926535897931,
  },
} satisfies ToolExample<Input, Output>;
export const archModelSegmentCurveChordGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/arch-model-segment-curve-chord-gap",
    title: "Arch Model Segment Curve Chord Gap Tool",
    description:
      "Calculate arch model segment curve chord gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        angleRadians: { type: "number" },
      },
      required: ["radius", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arcLength: { type: "number" },
        chordLength: { type: "number" },
        excess: { type: "number" },
      },
      required: ["arcLength", "chordLength", "excess"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "arcLength", label: "Arc Length", valueType: { type: "number" } },
        {
          id: "chordLength",
          label: "Chord Length",
          valueType: { type: "number" },
        },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = archModelSegmentCurveChordGapTool.execute;
export default archModelSegmentCurveChordGapTool;
