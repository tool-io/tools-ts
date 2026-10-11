import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entrySeconds: number;
  readonly anchorSeconds: number;
};
export type Output = { readonly relativeSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entrySeconds: { type: "number" },
    anchorSeconds: { type: "number" },
  },
  required: ["entrySeconds", "anchorSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeSeconds: { type: "number" } },
  required: ["relativeSeconds"],
} as const;
/** Express an explicit mood-diary timestamp relative to a supplied anchor without inferring mood cycles. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entrySeconds, anchorSeconds } = request;
  const compute = (): Output => {
    return { relativeSeconds: entrySeconds - anchorSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entrySeconds: 5400, anchorSeconds: 3600 },
  output: { relativeSeconds: 1800 },
} satisfies ToolExample<Input, Output>;
export const moodDiaryTimeAnchorTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["psychiatry", "health and medicine"],
        keywords: ["psychiatry", "health and medicine"],
      },
      id: "psychiatry/mood-diary-time-anchor",
      title: "Mood Diary Time Anchor",
      description:
        "Express an explicit mood-diary timestamp relative to a supplied anchor without inferring mood cycles.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entrySeconds: { type: "number" },
          anchorSeconds: { type: "number" },
        },
        required: ["entrySeconds", "anchorSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { relativeSeconds: { type: "number" } },
        required: ["relativeSeconds"],
      },
      ports: {
        inputs: [
          {
            id: "entrySeconds",
            label: "Entry Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "anchorSeconds",
            label: "Anchor Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeSeconds",
            label: "Relative Seconds",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = moodDiaryTimeAnchorTool.execute;
export default moodDiaryTimeAnchorTool;
