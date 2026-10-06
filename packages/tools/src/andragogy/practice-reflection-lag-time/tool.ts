import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly practiceEndSeconds: number;
  readonly reflectionStartSeconds: number;
};
export type Output = { readonly lagSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    practiceEndSeconds: { type: "number" },
    reflectionStartSeconds: { type: "number" },
  },
  required: ["practiceEndSeconds", "reflectionStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lagSeconds: { type: "number" } },
  required: ["lagSeconds"],
} as const;
/** Measure a signed reflection-start minus practice-end offset on one common timeline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { practiceEndSeconds, reflectionStartSeconds } = request;
  const compute = (): Output => {
    return { lagSeconds: reflectionStartSeconds - practiceEndSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { practiceEndSeconds: 1000, reflectionStartSeconds: 1600 },
  output: { lagSeconds: 600 },
} satisfies ToolExample<Input, Output>;
export const practiceReflectionLagTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/practice-reflection-lag-time",
    title: "Practice Reflection Lag Time",
    description:
      "Measure a signed reflection-start minus practice-end offset on one common timeline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        practiceEndSeconds: { type: "number" },
        reflectionStartSeconds: { type: "number" },
      },
      required: ["practiceEndSeconds", "reflectionStartSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lagSeconds: { type: "number" } },
      required: ["lagSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "practiceEndSeconds",
          label: "Practice End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reflectionStartSeconds",
          label: "Reflection Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lagSeconds",
          label: "Lag Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = practiceReflectionLagTimeTool.execute;
export default practiceReflectionLagTimeTool;
