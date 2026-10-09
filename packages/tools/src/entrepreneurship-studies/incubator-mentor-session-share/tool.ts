import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mentorMinutes: number;
  readonly totalSessionMinutes: number;
};
export type Output = { readonly mentorShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mentorMinutes: { type: "number", minimum: 0 },
    totalSessionMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mentorMinutes", "totalSessionMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mentorShare: { type: "number" } },
  required: ["mentorShare"],
} as const;
/** Calculate the mentor-time share of a supplied nonoverlapping incubator session duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mentorMinutes, totalSessionMinutes } = request;
  const compute = (): Output => {
    (H.domain(totalSessionMinutes > 0, "totalSessionMinutes"),
      totalSessionMinutes);
    H.domain(
      mentorMinutes >= 0 && mentorMinutes <= totalSessionMinutes,
      "mentorMinutes",
    );
    return { mentorShare: mentorMinutes / totalSessionMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mentorMinutes: 25, totalSessionMinutes: 100 },
  output: { mentorShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const incubatorMentorSessionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "entrepreneurship-studies",
        "entrepreneurship studies",
        "business and finance",
      ],
      keywords: ["entrepreneurship studies", "business and finance"],
    },
    id: "entrepreneurship-studies/incubator-mentor-session-share",
    title: "Incubator Mentor Session Share",
    description:
      "Calculate the mentor-time share of a supplied nonoverlapping incubator session duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mentorMinutes: { type: "number", minimum: 0 },
        totalSessionMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["mentorMinutes", "totalSessionMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mentorShare: { type: "number" } },
      required: ["mentorShare"],
    },
    ports: {
      inputs: [
        {
          id: "mentorMinutes",
          label: "Mentor Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalSessionMinutes",
          label: "Total Session Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mentorShare",
          label: "Mentor Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = incubatorMentorSessionShareTool.execute;
export default incubatorMentorSessionShareTool;
