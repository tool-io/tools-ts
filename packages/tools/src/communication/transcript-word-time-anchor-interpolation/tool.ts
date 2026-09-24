import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstWord: number;
  readonly lastWord: number;
  readonly firstTime: number;
  readonly lastTime: number;
  readonly targetWord: number;
};
export type Output = { readonly time: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstWord: { type: "integer", minimum: 0 },
    lastWord: { type: "integer" },
    firstTime: { type: "number" },
    lastTime: { type: "number" },
    targetWord: { type: "integer" },
  },
  required: ["firstWord", "lastWord", "firstTime", "lastTime", "targetWord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { time: { type: "number" } },
  required: ["time"],
} as const;
/** Calculate transcript word time anchor interpolation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstWord, lastWord, firstTime, lastTime, targetWord } = request;
  const compute = (): Output => {
    H.integer(firstWord, 0);
    H.integer(lastWord, firstWord + 1);
    H.integer(targetWord, firstWord, lastWord);
    H.domain(firstTime <= lastTime);
    return {
      time:
        firstTime +
        ((targetWord - firstWord) * (lastTime - firstTime)) /
          (lastWord - firstWord),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstWord: 10,
    lastWord: 20,
    firstTime: 5,
    lastTime: 15,
    targetWord: 14,
  },
  output: { time: 9 },
} satisfies ToolExample<Input, Output>;
export const transcriptWordTimeAnchorInterpolationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "communication/transcript-word-time-anchor-interpolation",
      title: "Transcript Word Time Anchor Interpolation Tool",
      description:
        "Calculate transcript word time anchor interpolation from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstWord: { type: "integer", minimum: 0 },
          lastWord: { type: "integer" },
          firstTime: { type: "number" },
          lastTime: { type: "number" },
          targetWord: { type: "integer" },
        },
        required: [
          "firstWord",
          "lastWord",
          "firstTime",
          "lastTime",
          "targetWord",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { time: { type: "number" } },
        required: ["time"],
      },
      ports: {
        inputs: [
          {
            id: "firstWord",
            label: "First Word",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "lastWord",
            label: "Last Word",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstTime",
            label: "First Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lastTime",
            label: "Last Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetWord",
            label: "Target Word",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [{ id: "time", label: "Time", valueType: { type: "number" } }],
      },
    },
    calculate,
  });
export const run = transcriptWordTimeAnchorInterpolationTool.execute;
export default transcriptWordTimeAnchorInterpolationTool;
