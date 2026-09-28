import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly periodHours: number;
  readonly recordedHours: number;
  readonly explicitlyMissingHours: number;
};
export type Output = {
  readonly unclassifiedHours: number;
  readonly recordedFraction: number;
  readonly missingFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodHours: { type: "number", exclusiveMinimum: 0 },
    recordedHours: { type: "number", minimum: 0 },
    explicitlyMissingHours: { type: "number", minimum: 0 },
  },
  required: ["periodHours", "recordedHours", "explicitlyMissingHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unclassifiedHours: { type: "number" },
    recordedFraction: { type: "number" },
    missingFraction: { type: "number" },
  },
  required: ["unclassifiedHours", "recordedFraction", "missingFraction"],
} as const;
/** Calculate geriatric diary missing hour share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { periodHours, recordedHours, explicitlyMissingHours } = request;
  const compute = (): Output => {
    H.positive(periodHours);
    H.domain(
      recordedHours >= 0 &&
        explicitlyMissingHours >= 0 &&
        recordedHours + explicitlyMissingHours <= periodHours,
    );
    return {
      unclassifiedHours: periodHours - recordedHours - explicitlyMissingHours,
      recordedFraction: recordedHours / periodHours,
      missingFraction: explicitlyMissingHours / periodHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { periodHours: 24, recordedHours: 18, explicitlyMissingHours: 4 },
  output: {
    unclassifiedHours: 2,
    recordedFraction: 0.75,
    missingFraction: 0.16666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const geriatricDiaryMissingHourShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/geriatric-diary-missing-hour-share",
    title: "Geriatric Diary Missing Hour Share Tool",
    description:
      "Calculate geriatric diary missing hour share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodHours: { type: "number", exclusiveMinimum: 0 },
        recordedHours: { type: "number", minimum: 0 },
        explicitlyMissingHours: { type: "number", minimum: 0 },
      },
      required: ["periodHours", "recordedHours", "explicitlyMissingHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unclassifiedHours: { type: "number" },
        recordedFraction: { type: "number" },
        missingFraction: { type: "number" },
      },
      required: ["unclassifiedHours", "recordedFraction", "missingFraction"],
    },
    ports: {
      inputs: [
        {
          id: "periodHours",
          label: "Period Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedHours",
          label: "Recorded Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "explicitlyMissingHours",
          label: "Explicitly Missing Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unclassifiedHours",
          label: "Unclassified Hours",
          valueType: { type: "number" },
        },
        {
          id: "recordedFraction",
          label: "Recorded Fraction",
          valueType: { type: "number" },
        },
        {
          id: "missingFraction",
          label: "Missing Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = geriatricDiaryMissingHourShareTool.execute;
export default geriatricDiaryMissingHourShareTool;
