import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prescribed: readonly number[];
  readonly observed: readonly number[];
  readonly areas: readonly number[];
};
export type Output = {
  readonly residuals: readonly number[];
  readonly areaWeightedResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prescribed: { type: "array", maxItems: 256, items: { type: "number" } },
    observed: { type: "array", maxItems: 256, items: { type: "number" } },
    areas: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["prescribed", "observed", "areas"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residuals: { type: "array", maxItems: 256, items: { type: "number" } },
    areaWeightedResidual: { type: "number" },
  },
  required: ["residuals", "areaWeightedResidual"],
} as const;
/** Compare supplied map-cell values with explicit area weights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prescribed, observed, areas } = request;
  const compute = (): Output => {
    H.sameLength(prescribed, observed);
    H.sameLength(prescribed, areas);
    H.domain(areas.every((x) => x >= 0) && areas.some((x) => x > 0));
    return {
      residuals: observed.map((x, i) => x - prescribed[i]),
      areaWeightedResidual:
        observed.reduce((a, x, i) => a + (x - prescribed[i]) * areas[i], 0) /
        areas.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prescribed: [2, 4], observed: [3, 2], areas: [10, 30] },
  output: { residuals: [1, -2], areaWeightedResidual: -1.25 },
} satisfies ToolExample<Input, Output>;
export const applicationMapPrescribedObservedResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "precision-agriculture/application-map-prescribed-observed-residual",
      title: "Application Map Prescribed Observed Residual Tool",
      description:
        "Compare supplied map-cell values with explicit area weights.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prescribed: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          observed: { type: "array", maxItems: 256, items: { type: "number" } },
          areas: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["prescribed", "observed", "areas"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residuals: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          areaWeightedResidual: { type: "number" },
        },
        required: ["residuals", "areaWeightedResidual"],
      },
      ports: {
        inputs: [
          {
            id: "prescribed",
            label: "Prescribed",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "areas",
            label: "Areas",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "residuals",
            label: "Residuals",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "areaWeightedResidual",
            label: "Area Weighted Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = applicationMapPrescribedObservedResidualTool.execute;
export default applicationMapPrescribedObservedResidualTool;
