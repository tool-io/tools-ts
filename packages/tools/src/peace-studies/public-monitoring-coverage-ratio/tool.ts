import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coveredUnits: number;
  readonly plannedUnits: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredUnits: { type: "number", minimum: 0 },
    plannedUnits: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coveredUnits", "plannedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Compare supplied monitoring effort with planned effort; excess coverage remains visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coveredUnits, plannedUnits } = request;
  const compute = (): Output => {
    H.domain(coveredUnits >= 0);
    H.positive(plannedUnits);
    return { ratio: coveredUnits / plannedUnits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coveredUnits: 8, plannedUnits: 10 },
  output: { ratio: 0.8 },
} satisfies ToolExample<Input, Output>;
export const publicMonitoringCoverageRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/public-monitoring-coverage-ratio",
    title: "Public Monitoring Coverage Ratio Tool",
    description:
      "Compare supplied monitoring effort with planned effort; excess coverage remains visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredUnits: { type: "number", minimum: 0 },
        plannedUnits: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["coveredUnits", "plannedUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "coveredUnits",
          label: "Covered Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedUnits",
          label: "Planned Units",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = publicMonitoringCoverageRatioTool.execute;
export default publicMonitoringCoverageRatioTool;
