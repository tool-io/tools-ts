import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trimMoment: number;
  readonly momentPerCentimeter: number;
};
export type Output = { readonly centimeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trimMoment: { type: "number" },
    momentPerCentimeter: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["trimMoment", "momentPerCentimeter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { centimeters: { type: "number" } },
  required: ["centimeters"],
} as const;
/** Calculate trim moment per centimeter factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trimMoment, momentPerCentimeter } = request;
  const compute = (): Output => {
    H.positive(momentPerCentimeter);
    return { centimeters: trimMoment / momentPerCentimeter };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trimMoment: 120, momentPerCentimeter: 30 },
  output: { centimeters: 4 },
} satisfies ToolExample<Input, Output>;
export const trimMomentPerCentimeterFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/trim-moment-per-centimeter-factor",
    title: "Trim Moment Per Centimeter Factor Tool",
    description:
      "Calculate trim moment per centimeter factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trimMoment: { type: "number" },
        momentPerCentimeter: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["trimMoment", "momentPerCentimeter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { centimeters: { type: "number" } },
      required: ["centimeters"],
    },
    ports: {
      inputs: [
        {
          id: "trimMoment",
          label: "Trim Moment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "momentPerCentimeter",
          label: "Moment Per Centimeter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "centimeters",
          label: "Centimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trimMomentPerCentimeterFactorTool.execute;
export default trimMomentPerCentimeterFactorTool;
