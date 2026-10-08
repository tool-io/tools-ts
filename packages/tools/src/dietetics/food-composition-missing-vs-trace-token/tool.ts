import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly componentId: string; readonly status: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["measured", "trace", "missing", "not-applicable"],
    },
  },
  required: ["componentId", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Distinguish explicitly supplied food-composition availability codes without replacing trace or missing quantities with zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentId, status } = request;
  const compute = (): Output => {
    H.domain(componentId.length > 0, "componentId");
    H.domain(
      ["measured", "trace", "missing", "not-applicable"].includes(status),
      "status",
    );
    return { label: componentId + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { componentId: "C17", status: "trace" },
  output: { label: "C17 [trace]" },
} satisfies ToolExample<Input, Output>;
export const foodCompositionMissingVsTraceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/food-composition-missing-vs-trace-token",
    title: "Food Composition Missing Vs Trace Token Tool",
    description:
      "Distinguish explicitly supplied food-composition availability codes without replacing trace or missing quantities with zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentId: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["measured", "trace", "missing", "not-applicable"],
        },
      },
      required: ["componentId", "status"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "componentId",
          label: "Component Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = foodCompositionMissingVsTraceTokenTool.execute;
export default foodCompositionMissingVsTraceTokenTool;
