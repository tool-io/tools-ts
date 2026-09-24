import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly string[];
  readonly second: readonly string[];
  readonly normalizeCase: boolean;
};
export type Output = {
  readonly shared: readonly string[];
  readonly firstOnly: readonly string[];
  readonly secondOnly: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    second: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    normalizeCase: { type: "boolean" },
  },
  required: ["first", "second", "normalizeCase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shared: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    firstOnly: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondOnly: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["shared", "firstOnly", "secondOnly"],
} as const;
/** Compare explicitly supplied ingredient tokens without equivalence or interaction inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, normalizeCase } = request;
  const compute = (): Output => {
    const norm = (x: string) => (normalizeCase ? x.toLowerCase() : x),
      a = [...new Set(first.map(norm))],
      b = [...new Set(second.map(norm))];
    return {
      shared: a.filter((x) => b.includes(x)),
      firstOnly: a.filter((x) => !b.includes(x)),
      secondOnly: b.filter((x) => !a.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: ["A", "B"], second: ["b", "C"], normalizeCase: true },
  output: { shared: ["b"], firstOnly: ["a"], secondOnly: ["c"] },
} satisfies ToolExample<Input, Output>;
export const medicationListActiveIngredientTokenPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-pharmacy/medication-list-active-ingredient-token-pair",
      title: "Medication List Active Ingredient Token Pair Tool",
      description:
        "Compare explicitly supplied ingredient tokens without equivalence or interaction inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          second: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          normalizeCase: { type: "boolean" },
        },
        required: ["first", "second", "normalizeCase"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shared: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          firstOnly: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          secondOnly: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["shared", "firstOnly", "secondOnly"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "normalizeCase",
            label: "Normalize Case",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "shared",
            label: "Shared",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "firstOnly",
            label: "First Only",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "secondOnly",
            label: "Second Only",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = medicationListActiveIngredientTokenPairTool.execute;
export default medicationListActiveIngredientTokenPairTool;
