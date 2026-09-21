import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fractions: readonly number[];
  readonly excludedComponent: number;
};
export type Output = {
  readonly retainedTotal: number;
  readonly normalized: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractions: { type: "array", maxItems: 256, items: { type: "number" } },
    excludedComponent: { type: "integer", minimum: 0 },
  },
  required: ["fractions", "excludedComponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedTotal: { type: "number" },
    normalized: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["retainedTotal", "normalized"],
} as const;
/** Normalize supplied bench mixture weights after one explicitly excluded component; no administered gas mixture recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fractions, excludedComponent } = request;
  const compute = (): Output => {
    H.domain(fractions.length > 0 && fractions.every((x) => x >= 0));
    H.integer(excludedComponent, 0, fractions.length - 1);
    const retainedTotal = fractions.reduce(
      (a, b, i) => a + (i === excludedComponent ? 0 : b),
      0,
    );
    H.positive(retainedTotal);
    return {
      retainedTotal,
      normalized: fractions.map((x, i) =>
        i === excludedComponent ? 0 : x / retainedTotal,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fractions: [0.2, 0.3, 0.5], excludedComponent: 2 },
  output: { retainedTotal: 0.5, normalized: [0.4, 0.6, 0] },
} satisfies ToolExample<Input, Output>;
export const benchGasFractionNormalizationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/bench-gas-fraction-normalization-term",
    title: "Bench Gas Fraction Normalization Term Tool",
    description:
      "Normalize supplied bench mixture weights after one explicitly excluded component; no administered gas mixture recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fractions: { type: "array", maxItems: 256, items: { type: "number" } },
        excludedComponent: { type: "integer", minimum: 0 },
      },
      required: ["fractions", "excludedComponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedTotal: { type: "number" },
        normalized: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["retainedTotal", "normalized"],
    },
    ports: {
      inputs: [
        {
          id: "fractions",
          label: "Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "excludedComponent",
          label: "Excluded Component",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "retainedTotal",
          label: "Retained Total",
          valueType: { type: "number" },
        },
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = benchGasFractionNormalizationTermTool.execute;
export default benchGasFractionNormalizationTermTool;
