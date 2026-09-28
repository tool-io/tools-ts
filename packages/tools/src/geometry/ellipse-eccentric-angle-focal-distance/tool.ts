import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly semimajor: number;
  readonly semiminor: number;
  readonly parameter: number;
};
export type Output = {
  readonly nearFocusDistance: number;
  readonly farFocusDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    semimajor: { type: "number" },
    semiminor: { type: "number", exclusiveMinimum: 0 },
    parameter: { type: "number" },
  },
  required: ["semimajor", "semiminor", "parameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nearFocusDistance: { type: "number" },
    farFocusDistance: { type: "number" },
  },
  required: ["nearFocusDistance", "farFocusDistance"],
} as const;
/** Calculate ellipse eccentric angle focal distance from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { semimajor, semiminor, parameter } = input;
  const compute = (): Output => {
    H.positive(semiminor);
    H.domain(semimajor >= semiminor);
    const c = Math.sqrt((semimajor - semiminor) * (semimajor + semiminor)),
      term = c * Math.cos(parameter);
    return {
      nearFocusDistance: semimajor - term,
      farFocusDistance: semimajor + term,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { semimajor: 5, semiminor: 3, parameter: 0 },
  output: { nearFocusDistance: 1, farFocusDistance: 9 },
} satisfies ToolExample<Input, Output>;
export const ellipseEccentricAngleFocalDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/ellipse-eccentric-angle-focal-distance",
    title: "Ellipse Eccentric Angle Focal Distance Tool",
    description:
      "Calculate ellipse eccentric angle focal distance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        semimajor: { type: "number" },
        semiminor: { type: "number", exclusiveMinimum: 0 },
        parameter: { type: "number" },
      },
      required: ["semimajor", "semiminor", "parameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nearFocusDistance: { type: "number" },
        farFocusDistance: { type: "number" },
      },
      required: ["nearFocusDistance", "farFocusDistance"],
    },
    ports: {
      inputs: [
        {
          id: "semimajor",
          label: "Semimajor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "semiminor",
          label: "Semiminor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "parameter",
          label: "Parameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nearFocusDistance",
          label: "Near Focus Distance",
          valueType: { type: "number" },
        },
        {
          id: "farFocusDistance",
          label: "Far Focus Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ellipseEccentricAngleFocalDistanceTool.execute;
export default ellipseEccentricAngleFocalDistanceTool;
