import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pauseStartSeconds: number;
  readonly resumeSeconds: number;
};
export type Output = { readonly interruptionSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pauseStartSeconds: { type: "number" },
    resumeSeconds: { type: "number" },
  },
  required: ["pauseStartSeconds", "resumeSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { interruptionSeconds: { type: "number" } },
  required: ["interruptionSeconds"],
} as const;
/** Subtract explicit task-pause and resume times without judging workload or care quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pauseStartSeconds, resumeSeconds } = request;
  const compute = (): Output => {
    H.domain(resumeSeconds >= pauseStartSeconds, "resumeSeconds");
    return { interruptionSeconds: resumeSeconds - pauseStartSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pauseStartSeconds: 100, resumeSeconds: 130 },
  output: { interruptionSeconds: 30 },
} satisfies ToolExample<Input, Output>;
export const nursingTaskInterruptionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nursing", "health and medicine"],
      keywords: ["nursing", "health and medicine"],
    },
    id: "nursing/nursing-task-interruption-gap",
    title: "Nursing Task Interruption Gap",
    description:
      "Subtract explicit task-pause and resume times without judging workload or care quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pauseStartSeconds: { type: "number" },
        resumeSeconds: { type: "number" },
      },
      required: ["pauseStartSeconds", "resumeSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { interruptionSeconds: { type: "number" } },
      required: ["interruptionSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "pauseStartSeconds",
          label: "Pause Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resumeSeconds",
          label: "Resume Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "interruptionSeconds",
          label: "Interruption Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nursingTaskInterruptionGapTool.execute;
export default nursingTaskInterruptionGapTool;
