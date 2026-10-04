import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly categoryTokens: readonly string[];
  readonly categoryEmissions: readonly number[];
  readonly excludedTokens: readonly string[];
};
export type Output = {
  readonly includedEmission: number;
  readonly excludedEmission: number;
  readonly unknownExclusions: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    categoryTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    categoryEmissions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    excludedTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["categoryTokens", "categoryEmissions", "excludedTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedEmission: { type: "number" },
    excludedEmission: { type: "number" },
    unknownExclusions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["includedEmission", "excludedEmission", "unknownExclusions"],
} as const;
/** Sum supplied signed emission quantities under explicit category exclusions without choosing an accounting standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { categoryTokens, categoryEmissions, excludedTokens } = request;
  const compute = (): Output => {
    H.sameLength(categoryTokens, categoryEmissions);
    H.domain(new Set(categoryTokens).size === categoryTokens.length);
    return {
      includedEmission: categoryEmissions.reduce(
        (a, b, i) => a + (excludedTokens.includes(categoryTokens[i]) ? 0 : b),
        0,
      ),
      excludedEmission: categoryEmissions.reduce(
        (a, b, i) => a + (excludedTokens.includes(categoryTokens[i]) ? b : 0),
        0,
      ),
      unknownExclusions: excludedTokens.filter(
        (x) => !categoryTokens.includes(x),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    categoryTokens: ["fuel", "power"],
    categoryEmissions: [20, 30],
    excludedTokens: ["power"],
  },
  output: { includedEmission: 20, excludedEmission: 30, unknownExclusions: [] },
} satisfies ToolExample<Input, Output>;
export const emissionBoundaryExclusionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/emission-boundary-exclusion-token",
    title: "Emission Boundary Exclusion Token Tool",
    description:
      "Sum supplied signed emission quantities under explicit category exclusions without choosing an accounting standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        categoryTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        categoryEmissions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        excludedTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["categoryTokens", "categoryEmissions", "excludedTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedEmission: { type: "number" },
        excludedEmission: { type: "number" },
        unknownExclusions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["includedEmission", "excludedEmission", "unknownExclusions"],
    },
    ports: {
      inputs: [
        {
          id: "categoryTokens",
          label: "Category Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "categoryEmissions",
          label: "Category Emissions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "excludedTokens",
          label: "Excluded Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "includedEmission",
          label: "Included Emission",
          valueType: { type: "number" },
        },
        {
          id: "excludedEmission",
          label: "Excluded Emission",
          valueType: { type: "number" },
        },
        {
          id: "unknownExclusions",
          label: "Unknown Exclusions",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = emissionBoundaryExclusionTokenTool.execute;
export default emissionBoundaryExclusionTokenTool;
