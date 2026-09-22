import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLatency: number;
  readonly secondLatency: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLatency: { type: "number", exclusiveMinimum: 0 },
    secondLatency: { type: "number", minimum: 0 },
  },
  required: ["firstLatency", "secondLatency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate prompt response latency ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLatency, secondLatency } = request;
  const compute = (): Output => {
    H.positive(firstLatency);
    H.domain(secondLatency >= 0);
    return { ratio: secondLatency / firstLatency };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLatency: 200, secondLatency: 300 },
  output: { ratio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const promptResponseLatencyRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/prompt-response-latency-ratio",
    title: "Prompt Response Latency Ratio Tool",
    description:
      "Calculate prompt response latency ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLatency: { type: "number", exclusiveMinimum: 0 },
        secondLatency: { type: "number", minimum: 0 },
      },
      required: ["firstLatency", "secondLatency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "firstLatency",
          label: "First Latency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLatency",
          label: "Second Latency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = promptResponseLatencyRatioTool.execute;
export default promptResponseLatencyRatioTool;
