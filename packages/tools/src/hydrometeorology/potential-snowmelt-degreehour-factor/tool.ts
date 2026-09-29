import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperature: number;
  readonly threshold: number;
  readonly hours: number;
  readonly meltPerDegreeHour: number;
  readonly availableSwe: number;
};
export type Output = {
  readonly degreeHours: number;
  readonly potentialMelt: number;
  readonly boundedMelt: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperature: { type: "number" },
    threshold: { type: "number" },
    hours: { type: "number", minimum: 0 },
    meltPerDegreeHour: { type: "number", minimum: 0 },
    availableSwe: { type: "number", minimum: 0 },
  },
  required: [
    "temperature",
    "threshold",
    "hours",
    "meltPerDegreeHour",
    "availableSwe",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degreeHours: { type: "number" },
    potentialMelt: { type: "number" },
    boundedMelt: { type: "number" },
  },
  required: ["degreeHours", "potentialMelt", "boundedMelt"],
} as const;
/** Positive degree-hour snowmelt with a supplied calibration coefficient and available SWE cap, not an energy-balance forecast. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperature, threshold, hours, meltPerDegreeHour, availableSwe } =
    request;
  const compute = (): Output => {
    H.domain(hours >= 0 && meltPerDegreeHour >= 0 && availableSwe >= 0);
    return {
      degreeHours: Math.max(0, temperature - threshold) * hours,
      potentialMelt:
        Math.max(0, temperature - threshold) * hours * meltPerDegreeHour,
      boundedMelt: Math.min(
        availableSwe,
        Math.max(0, temperature - threshold) * hours * meltPerDegreeHour,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    temperature: 5,
    threshold: 0,
    hours: 6,
    meltPerDegreeHour: 0.1,
    availableSwe: 10,
  },
  output: { degreeHours: 30, potentialMelt: 3, boundedMelt: 3 },
} satisfies ToolExample<Input, Output>;
export const potentialSnowmeltDegreehourFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/potential-snowmelt-degreehour-factor",
    title: "Potential Snowmelt Degreehour Factor Tool",
    description:
      "Positive degree-hour snowmelt with a supplied calibration coefficient and available SWE cap, not an energy-balance forecast.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temperature: { type: "number" },
        threshold: { type: "number" },
        hours: { type: "number", minimum: 0 },
        meltPerDegreeHour: { type: "number", minimum: 0 },
        availableSwe: { type: "number", minimum: 0 },
      },
      required: [
        "temperature",
        "threshold",
        "hours",
        "meltPerDegreeHour",
        "availableSwe",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degreeHours: { type: "number" },
        potentialMelt: { type: "number" },
        boundedMelt: { type: "number" },
      },
      required: ["degreeHours", "potentialMelt", "boundedMelt"],
    },
    ports: {
      inputs: [
        {
          id: "temperature",
          label: "Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meltPerDegreeHour",
          label: "Melt Per Degree Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableSwe",
          label: "Available Swe",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "degreeHours",
          label: "Degree Hours",
          valueType: { type: "number" },
        },
        {
          id: "potentialMelt",
          label: "Potential Melt",
          valueType: { type: "number" },
        },
        {
          id: "boundedMelt",
          label: "Bounded Melt",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = potentialSnowmeltDegreehourFactorTool.execute;
export default potentialSnowmeltDegreehourFactorTool;
