import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parts: readonly number[];
  readonly basis: number;
};
export type Output = { readonly amounts: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parts: { type: "array", maxItems: 256, items: { type: "number" } },
    basis: { type: "number", minimum: 0 },
  },
  required: ["parts", "basis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amounts: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["amounts"],
} as const;
/** Calculate weighted parts common basis crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parts, basis } = request;
  const compute = (): Output => {
    H.domain(parts.length > 0 && parts.every((x) => x >= 0) && basis >= 0);
    const sum = parts.reduce((a, b) => a + b, 0);
    H.positive(sum);
    return { amounts: parts.map((x) => (x / sum) * basis) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parts: [2, 3], basis: 100 },
  output: { amounts: [40, 60] },
} satisfies ToolExample<Input, Output>;
export const weightedPartsCommonBasisCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/weighted-parts-common-basis-crosswalk",
    title: "Weighted Parts Common Basis Crosswalk Tool",
    description:
      "Calculate weighted parts common basis crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parts: { type: "array", maxItems: 256, items: { type: "number" } },
        basis: { type: "number", minimum: 0 },
      },
      required: ["parts", "basis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amounts: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["amounts"],
    },
    ports: {
      inputs: [
        {
          id: "parts",
          label: "Parts",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "basis",
          label: "Basis",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "amounts",
          label: "Amounts",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = weightedPartsCommonBasisCrosswalkTool.execute;
export default weightedPartsCommonBasisCrosswalkTool;
