import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly radius: number; readonly halfChord: number };
export type Output = {
  readonly minorSagitta: number;
  readonly majorMinusMinorSagitta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    halfChord: { type: "number", minimum: 0 },
  },
  required: ["radius", "halfChord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minorSagitta: { type: "number" },
    majorMinusMinorSagitta: { type: "number" },
  },
  required: ["minorSagitta", "majorMinusMinorSagitta"],
} as const;
/** Calculate a stable minor sagitta and the major-minus-minor sagitta for explicit circle radius and half-chord. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, halfChord } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(radius) && radius > 0, "radius"), radius);
    H.domain(halfChord >= 0 && halfChord <= radius, "halfChord");
    return (() => {
      const ratio = halfChord / radius;
      const root = Math.sqrt((1 - ratio) * (1 + ratio));
      return {
        minorSagitta: (halfChord * ratio) / (1 + root),
        majorMinusMinorSagitta: radius * root * 2,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 5, halfChord: 3 },
  output: { minorSagitta: 0.9999999999999999, majorMinusMinorSagitta: 8 },
} satisfies ToolExample<Input, Output>;
export const circleChordSagittaDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geometry", "mathematics"],
      keywords: ["geometry", "mathematics"],
    },
    id: "geometry/circle-chord-sagitta-difference",
    title: "Circle Chord Sagitta Difference",
    description:
      "Calculate a stable minor sagitta and the major-minus-minor sagitta for explicit circle radius and half-chord.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        halfChord: { type: "number", minimum: 0 },
      },
      required: ["radius", "halfChord"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minorSagitta: { type: "number" },
        majorMinusMinorSagitta: { type: "number" },
      },
      required: ["minorSagitta", "majorMinusMinorSagitta"],
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
          id: "halfChord",
          label: "Half Chord",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minorSagitta",
          label: "Minor Sagitta",
          valueType: { type: "number" },
        },
        {
          id: "majorMinusMinorSagitta",
          label: "Major Minus Minor Sagitta",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = circleChordSagittaDifferenceTool.execute;
export default circleChordSagittaDifferenceTool;
