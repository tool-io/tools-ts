import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly storySeconds: number;
  readonly screenSeconds: number;
};
export type Output = {
  readonly compressionFactor: number;
  readonly omittedSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storySeconds: { type: "number", minimum: 0 },
    screenSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["storySeconds", "screenSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compressionFactor: { type: "number" },
    omittedSeconds: { type: "number" },
  },
  required: ["compressionFactor", "omittedSeconds"],
} as const;
/** Calculate screenplay montage time compression term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storySeconds, screenSeconds } = request;
  const compute = (): Output => {
    H.domain(storySeconds >= 0);
    H.positive(screenSeconds);
    return {
      compressionFactor: storySeconds / screenSeconds,
      omittedSeconds: storySeconds - screenSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storySeconds: 3600, screenSeconds: 60 },
  output: { compressionFactor: 60, omittedSeconds: 3540 },
} satisfies ToolExample<Input, Output>;
export const screenplayMontageTimeCompressionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "creative-writing/screenplay-montage-time-compression-term",
      title: "Screenplay Montage Time Compression Term Tool",
      description:
        "Calculate screenplay montage time compression term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          storySeconds: { type: "number", minimum: 0 },
          screenSeconds: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["storySeconds", "screenSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          compressionFactor: { type: "number" },
          omittedSeconds: { type: "number" },
        },
        required: ["compressionFactor", "omittedSeconds"],
      },
      ports: {
        inputs: [
          {
            id: "storySeconds",
            label: "Story Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "screenSeconds",
            label: "Screen Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
        ],
        outputs: [
          {
            id: "compressionFactor",
            label: "Compression Factor",
            valueType: { type: "number" },
          },
          {
            id: "omittedSeconds",
            label: "Omitted Seconds",
            valueType: { type: "number", unit: "s" },
          },
        ],
      },
    },
    calculate,
  });
export const run = screenplayMontageTimeCompressionTermTool.execute;
export default screenplayMontageTimeCompressionTermTool;
