import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly courseRecordId: string;
  readonly waiverStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    courseRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    waiverStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["granted", "denied", "pending", "not-requested", "unspecified"],
    },
  },
  required: ["courseRecordId", "waiverStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded prerequisite-waiver status without deciding course eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { courseRecordId, waiverStatus } = request;
  const compute = (): Output => {
    H.domain(courseRecordId.length > 0, "courseRecordId");
    H.domain(
      ["granted", "denied", "pending", "not-requested", "unspecified"].includes(
        waiverStatus,
      ),
      "waiverStatus",
    );
    return { label: courseRecordId + " [" + waiverStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { courseRecordId: "C17", waiverStatus: "pending" },
  output: { label: "C17 [pending]" },
} satisfies ToolExample<Input, Output>;
export const coursePrerequisiteWaiverStatusCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["education"],
      keywords: ["education"],
    },
    id: "education/course-prerequisite-waiver-status-code",
    title: "Course Prerequisite Waiver Status Code",
    description:
      "Label an explicitly recorded prerequisite-waiver status without deciding course eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        courseRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        waiverStatus: {
          type: "string",
          maxLength: 8192,
          enum: [
            "granted",
            "denied",
            "pending",
            "not-requested",
            "unspecified",
          ],
        },
      },
      required: ["courseRecordId", "waiverStatus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "courseRecordId",
          label: "Course Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "waiverStatus",
          label: "Waiver Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = coursePrerequisiteWaiverStatusCodeTool.execute;
export default coursePrerequisiteWaiverStatusCodeTool;
