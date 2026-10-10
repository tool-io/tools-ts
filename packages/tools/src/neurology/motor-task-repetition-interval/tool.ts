import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOnsetSeconds: number;
  readonly nextOnsetSeconds: number;
};
export type Output = { readonly intervalSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOnsetSeconds: { type: "number" },
    nextOnsetSeconds: { type: "number" },
  },
  required: ["firstOnsetSeconds", "nextOnsetSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intervalSeconds: { type: "number" } },
  required: ["intervalSeconds"],
} as const;
/** Subtract two explicitly ordered motor-task onset markers without inferring performance quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOnsetSeconds, nextOnsetSeconds } = request;
  const compute = (): Output => {
    H.domain(nextOnsetSeconds > firstOnsetSeconds, "nextOnsetSeconds");
    return { intervalSeconds: nextOnsetSeconds - firstOnsetSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOnsetSeconds: 3, nextOnsetSeconds: 5.5 },
  output: { intervalSeconds: 2.5 },
} satisfies ToolExample<Input, Output>;
export const motorTaskRepetitionIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neurology", "health and medicine"],
      keywords: ["neurology", "health and medicine"],
    },
    id: "neurology/motor-task-repetition-interval",
    title: "Motor Task Repetition Interval",
    description:
      "Subtract two explicitly ordered motor-task onset markers without inferring performance quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOnsetSeconds: { type: "number" },
        nextOnsetSeconds: { type: "number" },
      },
      required: ["firstOnsetSeconds", "nextOnsetSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { intervalSeconds: { type: "number" } },
      required: ["intervalSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "firstOnsetSeconds",
          label: "First Onset Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextOnsetSeconds",
          label: "Next Onset Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "intervalSeconds",
          label: "Interval Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = motorTaskRepetitionIntervalTool.execute;
export default motorTaskRepetitionIntervalTool;
