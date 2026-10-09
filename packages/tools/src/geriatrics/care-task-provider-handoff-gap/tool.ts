import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTaskEndMinutes: number;
  readonly nextTaskStartMinutes: number;
};
export type Output = { readonly gapMinutes: number; readonly overlap: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTaskEndMinutes: { type: "number" },
    nextTaskStartMinutes: { type: "number" },
  },
  required: ["firstTaskEndMinutes", "nextTaskStartMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gapMinutes: { type: "number" }, overlap: { type: "boolean" } },
  required: ["gapMinutes", "overlap"],
} as const;
/** Compare explicit care-task handoff times without assessing care sufficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTaskEndMinutes, nextTaskStartMinutes } = request;
  const compute = (): Output => {
    return {
      gapMinutes: nextTaskStartMinutes - firstTaskEndMinutes,
      overlap: nextTaskStartMinutes < firstTaskEndMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTaskEndMinutes: 60, nextTaskStartMinutes: 75 },
  output: { gapMinutes: 15, overlap: false },
} satisfies ToolExample<Input, Output>;
export const careTaskProviderHandoffGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["geriatrics", "health and medicine"],
      keywords: ["geriatrics", "health and medicine"],
    },
    id: "geriatrics/care-task-provider-handoff-gap",
    title: "Care Task Provider Handoff Gap",
    description:
      "Compare explicit care-task handoff times without assessing care sufficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTaskEndMinutes: { type: "number" },
        nextTaskStartMinutes: { type: "number" },
      },
      required: ["firstTaskEndMinutes", "nextTaskStartMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapMinutes: { type: "number" },
        overlap: { type: "boolean" },
      },
      required: ["gapMinutes", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "firstTaskEndMinutes",
          label: "First Task End Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextTaskStartMinutes",
          label: "Next Task Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gapMinutes",
          label: "Gap Minutes",
          valueType: { type: "number" },
        },
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = careTaskProviderHandoffGapTool.execute;
export default careTaskProviderHandoffGapTool;
