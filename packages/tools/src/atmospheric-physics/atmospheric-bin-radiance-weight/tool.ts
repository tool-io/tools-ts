import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radianceDensities: readonly number[];
  readonly binWidths: readonly number[];
  readonly responseWeights: readonly number[];
};
export type Output = {
  readonly integratedContribution: number;
  readonly totalWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radianceDensities: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    binWidths: { type: "array", maxItems: 256, items: { type: "number" } },
    responseWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["radianceDensities", "binWidths", "responseWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integratedContribution: { type: "number" },
    totalWidth: { type: "number" },
  },
  required: ["integratedContribution", "totalWidth"],
} as const;
/** Sum supplied piecewise-constant radiance-density contributions with explicit bin widths and instrument response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radianceDensities, binWidths, responseWeights } = request;
  const compute = (): Output => {
    H.sameLength(radianceDensities, binWidths);
    H.sameLength(binWidths, responseWeights);
    H.domain(
      [...radianceDensities, ...binWidths, ...responseWeights].every(
        (x) => x >= 0,
      ),
    );
    return {
      integratedContribution: radianceDensities.reduce(
        (s, x, i) => s + x * binWidths[i] * responseWeights[i],
        0,
      ),
      totalWidth: binWidths.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    radianceDensities: [2, 3],
    binWidths: [1, 2],
    responseWeights: [0.5, 1],
  },
  output: { integratedContribution: 7, totalWidth: 3 },
} satisfies ToolExample<Input, Output>;
export const atmosphericBinRadianceWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/atmospheric-bin-radiance-weight",
    title: "Atmospheric Bin Radiance Weight Tool",
    description:
      "Sum supplied piecewise-constant radiance-density contributions with explicit bin widths and instrument response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radianceDensities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        binWidths: { type: "array", maxItems: 256, items: { type: "number" } },
        responseWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["radianceDensities", "binWidths", "responseWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integratedContribution: { type: "number" },
        totalWidth: { type: "number" },
      },
      required: ["integratedContribution", "totalWidth"],
    },
    ports: {
      inputs: [
        {
          id: "radianceDensities",
          label: "Radiance Densities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "binWidths",
          label: "Bin Widths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "responseWeights",
          label: "Response Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "integratedContribution",
          label: "Integrated Contribution",
          valueType: { type: "number" },
        },
        {
          id: "totalWidth",
          label: "Total Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = atmosphericBinRadianceWeightTool.execute;
export default atmosphericBinRadianceWeightTool;
