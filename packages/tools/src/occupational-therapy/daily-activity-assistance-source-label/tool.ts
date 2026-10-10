import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityId: string;
  readonly assistanceWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityId: { type: "string", maxLength: 8192, minLength: 1 },
    assistanceWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["activityId", "assistanceWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit activity-assistance wording and source without assigning a functional score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityId, assistanceWording, source } = request;
  const compute = (): Output => {
    H.domain(activityId.length > 0, "activityId");
    H.domain(assistanceWording.length > 0, "assistanceWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([activityId, assistanceWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activityId: "A17",
    assistanceWording: "verbal prompt",
    source: "Observer A",
  },
  output: { token: '["A17","verbal prompt","Observer A"]' },
} satisfies ToolExample<Input, Output>;
export const dailyActivityAssistanceSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-therapy",
        "occupational therapy",
        "health and medicine",
      ],
      keywords: ["occupational therapy", "health and medicine"],
    },
    id: "occupational-therapy/daily-activity-assistance-source-label",
    title: "Daily Activity Assistance Source Label",
    description:
      "Record explicit activity-assistance wording and source without assigning a functional score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activityId: { type: "string", maxLength: 8192, minLength: 1 },
        assistanceWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["activityId", "assistanceWording", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "activityId",
          label: "Activity Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assistanceWording",
          label: "Assistance Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dailyActivityAssistanceSourceLabelTool.execute;
export default dailyActivityAssistanceSourceLabelTool;
