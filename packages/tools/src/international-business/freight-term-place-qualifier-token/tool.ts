import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly term: string;
  readonly place: string;
  readonly suppliedEdition: string;
  readonly allowedTerms: readonly string[];
};
export type Output = {
  readonly recognized: boolean;
  readonly hasPlace: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    term: { type: "string", maxLength: 8192 },
    place: { type: "string", maxLength: 8192 },
    suppliedEdition: { type: "string", maxLength: 8192 },
    allowedTerms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["term", "place", "suppliedEdition", "allowedTerms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "boolean" },
    hasPlace: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["recognized", "hasPlace", "key"],
} as const;
/** Preserve caller-supplied freight term, edition and named place without interpreting risk transfer or contract obligations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { term, place, suppliedEdition, allowedTerms } = request;
  const compute = (): Output => {
    return {
      recognized: allowedTerms.includes(term),
      hasPlace: place.trim().length > 0,
      key: JSON.stringify([suppliedEdition, term, place]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    term: "FCA",
    place: "Port A",
    suppliedEdition: "2020",
    allowedTerms: ["FCA", "DAP"],
  },
  output: { recognized: true, hasPlace: true, key: '["2020","FCA","Port A"]' },
} satisfies ToolExample<Input, Output>;
export const freightTermPlaceQualifierTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/freight-term-place-qualifier-token",
    title: "Freight Term Place Qualifier Token Tool",
    description:
      "Preserve caller-supplied freight term, edition and named place without interpreting risk transfer or contract obligations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string", maxLength: 8192 },
        place: { type: "string", maxLength: 8192 },
        suppliedEdition: { type: "string", maxLength: 8192 },
        allowedTerms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["term", "place", "suppliedEdition", "allowedTerms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        hasPlace: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["recognized", "hasPlace", "key"],
    },
    ports: {
      inputs: [
        {
          id: "term",
          label: "Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "place",
          label: "Place",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedEdition",
          label: "Supplied Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedTerms",
          label: "Allowed Terms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "hasPlace", label: "Has Place", valueType: { type: "boolean" } },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = freightTermPlaceQualifierTokenTool.execute;
export default freightTermPlaceQualifierTokenTool;
