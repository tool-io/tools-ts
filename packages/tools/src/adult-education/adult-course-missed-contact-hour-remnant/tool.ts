import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredHours: number;
  readonly completedHours: number;
  readonly missedHours: number;
};
export type Output = { readonly remainingHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredHours: { type: "number", minimum: 0 },
    completedHours: { type: "number", minimum: 0 },
    missedHours: { type: "number", minimum: 0 },
  },
  required: ["requiredHours", "completedHours", "missedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingHours: { type: "number" } },
  required: ["remainingHours"],
} as const;
/** Subtract recorded completed and missed contact hours from a supplied course-hour total, preserving over-allocation discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredHours, completedHours, missedHours } = request;
  const compute = (): Output => {
    H.domain(requiredHours >= 0, "requiredHours");
    H.domain(completedHours >= 0, "completedHours");
    H.domain(missedHours >= 0, "missedHours");
    return { remainingHours: requiredHours - completedHours - missedHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredHours: 40, completedHours: 24, missedHours: 4 },
  output: { remainingHours: 12 },
} satisfies ToolExample<Input, Output>;
export const adultCourseMissedContactHourRemnantTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["adult-education", "adult education", "education"],
        keywords: ["adult education", "education"],
      },
      id: "adult-education/adult-course-missed-contact-hour-remnant",
      title: "Adult Course Missed Contact Hour Remnant",
      description:
        "Subtract recorded completed and missed contact hours from a supplied course-hour total, preserving over-allocation discrepancies.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requiredHours: { type: "number", minimum: 0 },
          completedHours: { type: "number", minimum: 0 },
          missedHours: { type: "number", minimum: 0 },
        },
        required: ["requiredHours", "completedHours", "missedHours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { remainingHours: { type: "number" } },
        required: ["remainingHours"],
      },
      ports: {
        inputs: [
          {
            id: "requiredHours",
            label: "Required Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "completedHours",
            label: "Completed Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "missedHours",
            label: "Missed Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingHours",
            label: "Remaining Hours",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = adultCourseMissedContactHourRemnantTool.execute;
export default adultCourseMissedContactHourRemnantTool;
