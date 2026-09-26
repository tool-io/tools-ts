import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseAt: number;
  readonly presentedAt: number;
  readonly referenceLatency: number;
};
export type Output = { readonly latency: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseAt: { type: "number" },
    presentedAt: { type: "number" },
    referenceLatency: { type: "number", minimum: 0 },
  },
  required: ["responseAt", "presentedAt", "referenceLatency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { latency: { type: "number" }, gap: { type: "number" } },
  required: ["latency", "gap"],
} as const;
/** Calculate research item response latency gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseAt, presentedAt, referenceLatency } = request;
  const compute = (): Output => {
    H.domain(referenceLatency >= 0);
    return {
      latency: responseAt - presentedAt,
      gap: responseAt - presentedAt - referenceLatency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseAt: 500, presentedAt: 100, referenceLatency: 350 },
  output: { latency: 400, gap: 50 },
} satisfies ToolExample<Input, Output>;
export const researchItemResponseLatencyGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/research-item-response-latency-gap",
    title: "Research Item Response Latency Gap Tool",
    description:
      "Calculate research item response latency gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseAt: { type: "number" },
        presentedAt: { type: "number" },
        referenceLatency: { type: "number", minimum: 0 },
      },
      required: ["responseAt", "presentedAt", "referenceLatency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { latency: { type: "number" }, gap: { type: "number" } },
      required: ["latency", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "responseAt",
          label: "Response At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "presentedAt",
          label: "Presented At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLatency",
          label: "Reference Latency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "latency", label: "Latency", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = researchItemResponseLatencyGapTool.execute;
export default researchItemResponseLatencyGapTool;
