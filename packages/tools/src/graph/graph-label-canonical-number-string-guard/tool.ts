import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly label: string };
export type Output = { readonly canonical: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { canonical: { type: "boolean" } },
  required: ["canonical"],
} as const;
/** Check canonical safe-integer decimal spelling for a graph label; labels are never coerced in graph operations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label } = request;
  const compute = (): Output => {
    H.domain(label.length > 0);
    const n = Number(label);
    return { canonical: Number.isSafeInteger(n) && String(n) === label };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { label: "01" },
  output: { canonical: false },
} satisfies ToolExample<Input, Output>;
export const graphLabelCanonicalNumberStringGuardTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graph/graph-label-canonical-number-string-guard",
      title: "Graph Label Canonical Number String Guard Tool",
      description:
        "Check canonical safe-integer decimal spelling for a graph label; labels are never coerced in graph operations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { canonical: { type: "boolean" } },
        required: ["canonical"],
      },
      ports: {
        inputs: [
          {
            id: "label",
            label: "Label",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "canonical",
            label: "Canonical",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = graphLabelCanonicalNumberStringGuardTool.execute;
export default graphLabelCanonicalNumberStringGuardTool;
