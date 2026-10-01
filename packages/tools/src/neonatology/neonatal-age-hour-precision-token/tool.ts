import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthHourLower: number;
  readonly birthHourUpper: number;
  readonly observationHour: number;
};
export type Output = {
  readonly ageHoursLower: number;
  readonly ageHoursUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthHourLower: { type: "number" },
    birthHourUpper: { type: "number" },
    observationHour: { type: "number" },
  },
  required: ["birthHourLower", "birthHourUpper", "observationHour"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageHoursLower: { type: "number" },
    ageHoursUpper: { type: "number" },
  },
  required: ["ageHoursLower", "ageHoursUpper"],
} as const;
/** Bound elapsed hours from supplied absolute-time birth precision without clinical age categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthHourLower, birthHourUpper, observationHour } = request;
  const compute = (): Output => {
    H.domain(
      birthHourLower <= birthHourUpper && observationHour >= birthHourUpper,
    );
    return {
      ageHoursLower: observationHour - birthHourUpper,
      ageHoursUpper: observationHour - birthHourLower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { birthHourLower: 10, birthHourUpper: 11, observationHour: 20 },
  output: { ageHoursLower: 9, ageHoursUpper: 10 },
} satisfies ToolExample<Input, Output>;
export const neonatalAgeHourPrecisionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/neonatal-age-hour-precision-token",
    title: "Neonatal Age Hour Precision Token Tool",
    description:
      "Bound elapsed hours from supplied absolute-time birth precision without clinical age categories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthHourLower: { type: "number" },
        birthHourUpper: { type: "number" },
        observationHour: { type: "number" },
      },
      required: ["birthHourLower", "birthHourUpper", "observationHour"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageHoursLower: { type: "number" },
        ageHoursUpper: { type: "number" },
      },
      required: ["ageHoursLower", "ageHoursUpper"],
    },
    ports: {
      inputs: [
        {
          id: "birthHourLower",
          label: "Birth Hour Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "birthHourUpper",
          label: "Birth Hour Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationHour",
          label: "Observation Hour",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ageHoursLower",
          label: "Age Hours Lower",
          valueType: { type: "number" },
        },
        {
          id: "ageHoursUpper",
          label: "Age Hours Upper",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = neonatalAgeHourPrecisionTokenTool.execute;
export default neonatalAgeHourPrecisionTokenTool;
