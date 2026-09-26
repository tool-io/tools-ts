import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pages: number;
  readonly availableMinutes: number;
};
export type Output = {
  readonly pagesPerMinute: number;
  readonly minutesPerPage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pages: { type: "number", exclusiveMinimum: 0 },
    availableMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pages", "availableMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pagesPerMinute: { type: "number" },
    minutesPerPage: { type: "number" },
  },
  required: ["pagesPerMinute", "minutesPerPage"],
} as const;
/** Calculate reading assignment pace page term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pages, availableMinutes } = request;
  const compute = (): Output => {
    H.positive(pages);
    H.positive(availableMinutes);
    return {
      pagesPerMinute: pages / availableMinutes,
      minutesPerPage: availableMinutes / pages,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pages: 30, availableMinutes: 60 },
  output: { pagesPerMinute: 0.5, minutesPerPage: 2 },
} satisfies ToolExample<Input, Output>;
export const readingAssignmentPacePageTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/reading-assignment-pace-page-term",
    title: "Reading Assignment Pace Page Term Tool",
    description:
      "Calculate reading assignment pace page term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pages: { type: "number", exclusiveMinimum: 0 },
        availableMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pages", "availableMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pagesPerMinute: { type: "number" },
        minutesPerPage: { type: "number" },
      },
      required: ["pagesPerMinute", "minutesPerPage"],
    },
    ports: {
      inputs: [
        {
          id: "pages",
          label: "Pages",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableMinutes",
          label: "Available Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pagesPerMinute",
          label: "Pages Per Minute",
          valueType: { type: "number" },
        },
        {
          id: "minutesPerPage",
          label: "Minutes Per Page",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = readingAssignmentPacePageTermTool.execute;
export default readingAssignmentPacePageTermTool;
