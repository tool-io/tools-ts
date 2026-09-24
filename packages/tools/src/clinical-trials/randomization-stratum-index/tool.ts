import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly levels: readonly string[];
  readonly suppliedStrata: readonly string[];
};
export type Output = {
  readonly found: boolean;
  readonly index: number;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedStrata: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["levels", "suppliedStrata"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    found: { type: "boolean" },
    index: { type: "integer" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["found", "index", "key"],
} as const;
/** Locate an explicit stratum tuple in a caller-supplied ordered list; no randomization is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { levels, suppliedStrata } = request;
  const compute = (): Output => {
    H.domain(new Set(suppliedStrata).size === suppliedStrata.length);
    return {
      found: suppliedStrata.includes(JSON.stringify(levels)),
      index: suppliedStrata.indexOf(JSON.stringify(levels)),
      key: JSON.stringify(levels),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { levels: ["A", "B"], suppliedStrata: ['["A","B"]', '["A","C"]'] },
  output: { found: true, index: 0, key: '["A","B"]' },
} satisfies ToolExample<Input, Output>;
export const randomizationStratumIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/randomization-stratum-index",
    title: "Randomization Stratum Index Tool",
    description:
      "Locate an explicit stratum tuple in a caller-supplied ordered list; no randomization is performed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedStrata: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["levels", "suppliedStrata"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        found: { type: "boolean" },
        index: { type: "integer" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["found", "index", "key"],
    },
    ports: {
      inputs: [
        {
          id: "levels",
          label: "Levels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedStrata",
          label: "Supplied Strata",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        { id: "index", label: "Index", valueType: { type: "integer" } },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = randomizationStratumIndexTool.execute;
export default randomizationStratumIndexTool;
