import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly speakers: readonly string[] };
export type Output = {
  readonly changes: number;
  readonly runSpeakers: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speakers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["speakers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changes: { type: "integer" },
    runSpeakers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["changes", "runSpeakers"],
} as const;
/** Calculate dramatic line speaker change count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speakers } = request;
  const compute = (): Output => {
    const runSpeakers = speakers.filter(
      (s, i) => i === 0 || s !== speakers[i - 1],
    );
    return { changes: Math.max(0, runSpeakers.length - 1), runSpeakers };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speakers: ["A", "A", "B", "A"] },
  output: { changes: 2, runSpeakers: ["A", "B", "A"] },
} satisfies ToolExample<Input, Output>;
export const dramaticLineSpeakerChangeCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/dramatic-line-speaker-change-count",
    title: "Dramatic Line Speaker Change Count Tool",
    description:
      "Calculate dramatic line speaker change count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speakers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["speakers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changes: { type: "integer" },
        runSpeakers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["changes", "runSpeakers"],
    },
    ports: {
      inputs: [
        {
          id: "speakers",
          label: "Speakers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "changes", label: "Changes", valueType: { type: "integer" } },
        {
          id: "runSpeakers",
          label: "Run Speakers",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = dramaticLineSpeakerChangeCountTool.execute;
export default dramaticLineSpeakerChangeCountTool;
