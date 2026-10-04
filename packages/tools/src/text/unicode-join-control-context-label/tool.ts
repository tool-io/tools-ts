import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  codePoint,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly point: number };
export type Output = { readonly kind: string; readonly joinControl: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { point: { type: "integer" } },
  required: ["point"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    joinControl: { type: "boolean" },
  },
  required: ["kind", "joinControl"],
} as const;
/** Compute unicode join control context label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point } = input;
  const compute = (): Output => {
    codePoint(point);
    return {
      kind: point === 0x200c ? "zwnj" : point === 0x200d ? "zwj" : "other",
      joinControl: point === 0x200c || point === 0x200d,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: 8205 },
  output: { kind: "zwj", joinControl: true },
} satisfies ToolExample<Input, Output>;
export const unicodeJoinControlContextLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/unicode-join-control-context-label",
  title: "Unicode Join Control Context Label Tool",
  description:
    "Compute unicode join control context label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "point",
        label: "Point",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "kind", label: "Kind", valueType: { type: "string" } },
      {
        id: "joinControl",
        label: "Join Control",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = unicodeJoinControlContextLabelTool.execute;
export default unicodeJoinControlContextLabelTool;
