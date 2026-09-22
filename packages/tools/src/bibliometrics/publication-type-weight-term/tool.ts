import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly type: string;
  readonly suppliedTypes: readonly string[];
  readonly weights: readonly number[];
};
export type Output = { readonly known: boolean; readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    type: { type: "string", maxLength: 8192 },
    suppliedTypes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["type", "suppliedTypes", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { known: { type: "boolean" }, weight: { type: "number" } },
  required: ["known", "weight"],
} as const;
/** Look up an explicit user-defined publication weight without asserting a universal bibliometric score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { type, suppliedTypes, weights } = request;
  const compute = (): Output => {
    H.sameLength(suppliedTypes, weights);
    H.domain(
      new Set(suppliedTypes).size === suppliedTypes.length &&
        weights.every((x) => x >= 0),
    );
    return {
      known: suppliedTypes.includes(type),
      weight: weights[suppliedTypes.indexOf(type)] ?? 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    type: "article",
    suppliedTypes: ["article", "book"],
    weights: [1, 2],
  },
  output: { known: true, weight: 1 },
} satisfies ToolExample<Input, Output>;
export const publicationTypeWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/publication-type-weight-term",
    title: "Publication Type Weight Term Tool",
    description:
      "Look up an explicit user-defined publication weight without asserting a universal bibliometric score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { type: "string", maxLength: 8192 },
        suppliedTypes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["type", "suppliedTypes", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { known: { type: "boolean" }, weight: { type: "number" } },
      required: ["known", "weight"],
    },
    ports: {
      inputs: [
        {
          id: "type",
          label: "Type",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTypes",
          label: "Supplied Types",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "boolean" } },
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = publicationTypeWeightTermTool.execute;
export default publicationTypeWeightTermTool;
