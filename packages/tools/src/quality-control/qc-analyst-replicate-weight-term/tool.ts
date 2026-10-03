import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly results: readonly number[];
  readonly uncertainties: readonly number[];
};
export type Output = {
  readonly weightedMean: number;
  readonly weightSum: number;
  readonly combinedStandard: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    results: { type: "array", maxItems: 256, items: { type: "number" } },
    uncertainties: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["results", "uncertainties"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedMean: { type: "number" },
    weightSum: { type: "number" },
    combinedStandard: { type: "number" },
  },
  required: ["weightedMean", "weightSum", "combinedStandard"],
} as const;
/** Inverse-variance replicate combination under supplied independent standard uncertainties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { results, uncertainties } = request;
  const compute = (): Output => {
    H.sameLength(results, uncertainties);
    H.domain(results.length > 0 && uncertainties.every((x) => x > 0));
    return {
      weightedMean:
        results.reduce((a, x, i) => a + x / uncertainties[i] ** 2, 0) /
        uncertainties.reduce((a, x) => a + 1 / x ** 2, 0),
      weightSum: uncertainties.reduce((a, x) => a + 1 / x ** 2, 0),
      combinedStandard:
        1 / Math.sqrt(uncertainties.reduce((a, x) => a + 1 / x ** 2, 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { results: [10, 12], uncertainties: [1, 2] },
  output: {
    weightedMean: 10.4,
    weightSum: 1.25,
    combinedStandard: 0.8944271909999159,
  },
} satisfies ToolExample<Input, Output>;
export const qcAnalystReplicateWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/qc-analyst-replicate-weight-term",
    title: "QC Analyst Replicate Weight Term Tool",
    description:
      "Inverse-variance replicate combination under supplied independent standard uncertainties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        results: { type: "array", maxItems: 256, items: { type: "number" } },
        uncertainties: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["results", "uncertainties"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedMean: { type: "number" },
        weightSum: { type: "number" },
        combinedStandard: { type: "number" },
      },
      required: ["weightedMean", "weightSum", "combinedStandard"],
    },
    ports: {
      inputs: [
        {
          id: "results",
          label: "Results",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "uncertainties",
          label: "Uncertainties",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "weightedMean",
          label: "Weighted Mean",
          valueType: { type: "number" },
        },
        { id: "weightSum", label: "Weight Sum", valueType: { type: "number" } },
        {
          id: "combinedStandard",
          label: "Combined Standard",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcAnalystReplicateWeightTermTool.execute;
export default qcAnalystReplicateWeightTermTool;
