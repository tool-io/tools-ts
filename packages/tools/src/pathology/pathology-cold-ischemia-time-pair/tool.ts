import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly removalTimestampMinutes: number;
  readonly fixationStartTimestampMinutes: number;
};
export type Output = { readonly intervalMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removalTimestampMinutes: { type: "number" },
    fixationStartTimestampMinutes: { type: "number" },
  },
  required: ["removalTimestampMinutes", "fixationStartTimestampMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intervalMinutes: { type: "number" } },
  required: ["intervalMinutes"],
} as const;
/** Subtract explicit specimen removal and fixation-start timestamps without choosing acceptable cold-ischemia limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { removalTimestampMinutes, fixationStartTimestampMinutes } = request;
  const compute = (): Output => {
    H.domain(
      fixationStartTimestampMinutes >= removalTimestampMinutes,
      "fixationStartTimestampMinutes",
    );
    return {
      intervalMinutes: fixationStartTimestampMinutes - removalTimestampMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { removalTimestampMinutes: 100, fixationStartTimestampMinutes: 125 },
  output: { intervalMinutes: 25 },
} satisfies ToolExample<Input, Output>;
export const pathologyColdischemiaTimePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pathology", "health and medicine"],
      keywords: ["pathology", "health and medicine"],
    },
    id: "pathology/pathology-cold-ischemia-time-pair",
    title: "Pathology Cold Ischemia Time Pair",
    description:
      "Subtract explicit specimen removal and fixation-start timestamps without choosing acceptable cold-ischemia limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removalTimestampMinutes: { type: "number" },
        fixationStartTimestampMinutes: { type: "number" },
      },
      required: ["removalTimestampMinutes", "fixationStartTimestampMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { intervalMinutes: { type: "number" } },
      required: ["intervalMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "removalTimestampMinutes",
          label: "Removal Timestamp Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixationStartTimestampMinutes",
          label: "Fixation Start Timestamp Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "intervalMinutes",
          label: "Interval Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pathologyColdischemiaTimePairTool.execute;
export default pathologyColdischemiaTimePairTool;
