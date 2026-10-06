import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly courseId: string; readonly mode: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    courseId: { type: "string", maxLength: 8192, minLength: 1 },
    mode: {
      type: "string",
      maxLength: 8192,
      enum: ["online", "offline", "hybrid"],
    },
  },
  required: ["courseId", "mode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label the explicit delivery mode of one adult-learning course. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { courseId, mode } = request;
  const compute = (): Output => {
    H.domain(courseId.length > 0, "courseId");
    H.domain(["online", "offline", "hybrid"].includes(mode), "mode");
    return { label: courseId + " [" + mode + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { courseId: "C17", mode: "hybrid" },
  output: { label: "C17 [hybrid]" },
} satisfies ToolExample<Input, Output>;
export const adultCourseOnlineOfflineModeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/adult-course-online-offline-mode-label",
    title: "Adult Course Online Offline Mode Label",
    description:
      "Label the explicit delivery mode of one adult-learning course.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        courseId: { type: "string", maxLength: 8192, minLength: 1 },
        mode: {
          type: "string",
          maxLength: 8192,
          enum: ["online", "offline", "hybrid"],
        },
      },
      required: ["courseId", "mode"],
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
          id: "courseId",
          label: "Course Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mode",
          label: "Mode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = adultCourseOnlineOfflineModeLabelTool.execute;
export default adultCourseOnlineOfflineModeLabelTool;
