import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pigmentNames: readonly string[];
  readonly parts: readonly number[];
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pigmentNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    parts: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["pigmentNames", "parts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a recorded pigment test mixture using explicit parts; no optical color prediction or pigment compatibility is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pigmentNames, parts } = request;
  const compute = (): Output => {
    H.sameLength(pigmentNames, parts);
    H.domain(
      parts.length > 0 && pigmentNames.every((v) => v.length > 0),
      "parts",
    );
    parts.forEach((v) => H.domain(v >= 0, "pigmentNames"));
    H.domain(
      parts.some((v) => v > 0),
      "parts",
    );
    return {
      label: pigmentNames
        .map((name, i) => name + "=" + parts[i] + " parts")
        .join("; "),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pigmentNames: ["blue", "white"], parts: [1, 4] },
  output: { label: "blue=1 parts; white=4 parts" },
} satisfies ToolExample<Input, Output>;
export const pigmentTestChipMixtureLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/pigment-test-chip-mixture-label",
    title: "Pigment Test Chip Mixture Label Tool",
    description:
      "Label a recorded pigment test mixture using explicit parts; no optical color prediction or pigment compatibility is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pigmentNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        parts: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["pigmentNames", "parts"],
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
          id: "pigmentNames",
          label: "Pigment Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "parts",
          label: "Parts",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pigmentTestChipMixtureLabelTool.execute;
export default pigmentTestChipMixtureLabelTool;
