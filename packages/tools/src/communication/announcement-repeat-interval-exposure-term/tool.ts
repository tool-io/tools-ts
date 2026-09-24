import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowSeconds: number;
  readonly repeatSeconds: number;
  readonly includeAtStart: boolean;
};
export type Output = { readonly announcements: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowSeconds: { type: "number", minimum: 0 },
    repeatSeconds: { type: "number", exclusiveMinimum: 0 },
    includeAtStart: { type: "boolean" },
  },
  required: ["windowSeconds", "repeatSeconds", "includeAtStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { announcements: { type: "integer" } },
  required: ["announcements"],
} as const;
/** Count repeats through the inclusive window end with an explicit announcement-at-start policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windowSeconds, repeatSeconds, includeAtStart } = request;
  const compute = (): Output => {
    H.domain(windowSeconds >= 0);
    H.positive(repeatSeconds);
    return {
      announcements:
        Math.floor(windowSeconds / repeatSeconds) + (includeAtStart ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { windowSeconds: 100, repeatSeconds: 30, includeAtStart: true },
  output: { announcements: 4 },
} satisfies ToolExample<Input, Output>;
export const announcementRepeatIntervalExposureTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "communication/announcement-repeat-interval-exposure-term",
      title: "Announcement Repeat Interval Exposure Term Tool",
      description:
        "Count repeats through the inclusive window end with an explicit announcement-at-start policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          windowSeconds: { type: "number", minimum: 0 },
          repeatSeconds: { type: "number", exclusiveMinimum: 0 },
          includeAtStart: { type: "boolean" },
        },
        required: ["windowSeconds", "repeatSeconds", "includeAtStart"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { announcements: { type: "integer" } },
        required: ["announcements"],
      },
      ports: {
        inputs: [
          {
            id: "windowSeconds",
            label: "Window Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "repeatSeconds",
            label: "Repeat Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeAtStart",
            label: "Include At Start",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "announcements",
            label: "Announcements",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = announcementRepeatIntervalExposureTermTool.execute;
export default announcementRepeatIntervalExposureTermTool;
