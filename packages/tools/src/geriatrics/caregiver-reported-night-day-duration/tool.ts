import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dayHours: number;
  readonly nightHours: number;
  readonly overlappingHours: number;
  readonly missingHours: number;
  readonly periodHours: number;
};
export type Output = {
  readonly observedHours: number;
  readonly unallocatedHours: number;
  readonly coverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayHours: { type: "number", minimum: 0 },
    nightHours: { type: "number", minimum: 0 },
    overlappingHours: { type: "number", minimum: 0 },
    missingHours: { type: "number", minimum: 0 },
    periodHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "dayHours",
    "nightHours",
    "overlappingHours",
    "missingHours",
    "periodHours",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedHours: { type: "number" },
    unallocatedHours: { type: "number" },
    coverage: { type: "number" },
  },
  required: ["observedHours", "unallocatedHours", "coverage"],
} as const;
/** Calculate caregiver reported night day duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dayHours, nightHours, overlappingHours, missingHours, periodHours } =
    request;
  const compute = (): Output => {
    H.positive(periodHours);
    H.domain(
      dayHours >= 0 &&
        nightHours >= 0 &&
        overlappingHours >= 0 &&
        overlappingHours <= Math.min(dayHours, nightHours) &&
        missingHours >= 0 &&
        dayHours + nightHours - overlappingHours + missingHours <= periodHours,
    );
    return {
      observedHours: dayHours + nightHours - overlappingHours,
      unallocatedHours:
        periodHours - dayHours - nightHours + overlappingHours - missingHours,
      coverage: (dayHours + nightHours - overlappingHours) / periodHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dayHours: 10,
    nightHours: 8,
    overlappingHours: 1,
    missingHours: 2,
    periodHours: 24,
  },
  output: {
    observedHours: 17,
    unallocatedHours: 5,
    coverage: 0.7083333333333334,
  },
} satisfies ToolExample<Input, Output>;
export const caregiverReportedNightDayDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/caregiver-reported-night-day-duration",
    title: "Caregiver Reported Night Day Duration Tool",
    description:
      "Calculate caregiver reported night day duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayHours: { type: "number", minimum: 0 },
        nightHours: { type: "number", minimum: 0 },
        overlappingHours: { type: "number", minimum: 0 },
        missingHours: { type: "number", minimum: 0 },
        periodHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "dayHours",
        "nightHours",
        "overlappingHours",
        "missingHours",
        "periodHours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedHours: { type: "number" },
        unallocatedHours: { type: "number" },
        coverage: { type: "number" },
      },
      required: ["observedHours", "unallocatedHours", "coverage"],
    },
    ports: {
      inputs: [
        {
          id: "dayHours",
          label: "Day Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nightHours",
          label: "Night Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlappingHours",
          label: "Overlapping Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingHours",
          label: "Missing Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodHours",
          label: "Period Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedHours",
          label: "Observed Hours",
          valueType: { type: "number" },
        },
        {
          id: "unallocatedHours",
          label: "Unallocated Hours",
          valueType: { type: "number" },
        },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = caregiverReportedNightDayDurationTool.execute;
export default caregiverReportedNightDayDurationTool;
