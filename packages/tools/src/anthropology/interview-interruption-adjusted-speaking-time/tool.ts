import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly interruptions: readonly number[];
};
export type Output = { readonly speakingTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    interruptions: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["elapsed", "interruptions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { speakingTime: { type: "number" } },
  required: ["speakingTime"],
} as const;
/** Calculate interview interruption adjusted speaking time from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, interruptions } = request;
  const compute = (): Output => {
    H.domain(
      elapsed >= 0 &&
        interruptions.every((x) => x >= 0) &&
        interruptions.reduce((a, b) => a + b, 0) <= elapsed,
    );
    return { speakingTime: elapsed - interruptions.reduce((a, b) => a + b, 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsed: 60, interruptions: [5, 10] },
  output: { speakingTime: 45 },
} satisfies ToolExample<Input, Output>;
export const interviewInterruptionAdjustedSpeakingTimeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anthropology/interview-interruption-adjusted-speaking-time",
      title: "Interview Interruption Adjusted Speaking Time Tool",
      description:
        "Calculate interview interruption adjusted speaking time from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsed: { type: "number", minimum: 0 },
          interruptions: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["elapsed", "interruptions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { speakingTime: { type: "number" } },
        required: ["speakingTime"],
      },
      ports: {
        inputs: [
          {
            id: "elapsed",
            label: "Elapsed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interruptions",
            label: "Interruptions",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "speakingTime",
            label: "Speaking Time",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = interviewInterruptionAdjustedSpeakingTimeTool.execute;
export default interviewInterruptionAdjustedSpeakingTimeTool;
