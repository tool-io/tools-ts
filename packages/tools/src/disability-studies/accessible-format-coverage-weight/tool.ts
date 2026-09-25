import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredFormats: readonly string[];
  readonly availableFormats: readonly string[];
  readonly weights: readonly number[];
};
export type Output = {
  readonly coveredWeight: number;
  readonly totalWeight: number;
  readonly weightedCoverage: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredFormats: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    availableFormats: {
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
  required: ["requiredFormats", "availableFormats", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredWeight: { type: "number" },
    totalWeight: { type: "number" },
    weightedCoverage: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["coveredWeight", "totalWeight", "weightedCoverage", "defined"],
} as const;
/** Calculate accessible format coverage weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredFormats, availableFormats, weights } = request;
  const compute = (): Output => {
    H.sameLength(requiredFormats, weights);
    H.domain(
      new Set(requiredFormats).size === requiredFormats.length &&
        weights.every((x) => x >= 0),
    );
    return (() => {
      const totalWeight = weights.reduce((a, b) => a + b, 0),
        coveredWeight = weights.reduce(
          (s, w, i) =>
            s + (availableFormats.includes(requiredFormats[i]) ? w : 0),
          0,
        );
      return {
        coveredWeight,
        totalWeight,
        weightedCoverage: totalWeight > 0 ? coveredWeight / totalWeight : 0,
        defined: totalWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredFormats: ["text", "audio"],
    availableFormats: ["text"],
    weights: [3, 1],
  },
  output: {
    coveredWeight: 3,
    totalWeight: 4,
    weightedCoverage: 0.75,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const accessibleFormatCoverageWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/accessible-format-coverage-weight",
    title: "Accessible Format Coverage Weight Tool",
    description:
      "Calculate accessible format coverage weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFormats: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        availableFormats: {
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
      required: ["requiredFormats", "availableFormats", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredWeight: { type: "number" },
        totalWeight: { type: "number" },
        weightedCoverage: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["coveredWeight", "totalWeight", "weightedCoverage", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "requiredFormats",
          label: "Required Formats",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "availableFormats",
          label: "Available Formats",
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
        {
          id: "coveredWeight",
          label: "Covered Weight",
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        {
          id: "weightedCoverage",
          label: "Weighted Coverage",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = accessibleFormatCoverageWeightTool.execute;
export default accessibleFormatCoverageWeightTool;
