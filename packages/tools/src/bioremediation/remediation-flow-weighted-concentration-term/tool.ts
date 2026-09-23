import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentrations: readonly number[];
  readonly volumes: readonly number[];
};
export type Output = {
  readonly totalVolume: number;
  readonly weightedConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentrations: { type: "array", maxItems: 256, items: { type: "number" } },
    volumes: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["concentrations", "volumes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number" },
    weightedConcentration: { type: "number" },
  },
  required: ["totalVolume", "weightedConcentration"],
} as const;
/** Calculate remediation flow weighted concentration term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentrations, volumes } = request;
  const compute = (): Output => {
    H.sameLength(concentrations, volumes);
    H.domain(
      concentrations.every((x) => x >= 0) &&
        volumes.every((x) => x >= 0) &&
        volumes.some((x) => x > 0),
    );
    return {
      totalVolume: volumes.reduce((a, b) => a + b, 0),
      weightedConcentration:
        H.dot(concentrations, volumes) / volumes.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentrations: [2, 6], volumes: [10, 30] },
  output: { totalVolume: 40, weightedConcentration: 5 },
} satisfies ToolExample<Input, Output>;
export const remediationFlowWeightedConcentrationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioremediation/remediation-flow-weighted-concentration-term",
      title: "Remediation Flow Weighted Concentration Term Tool",
      description:
        "Calculate remediation flow weighted concentration term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          concentrations: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          volumes: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["concentrations", "volumes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalVolume: { type: "number" },
          weightedConcentration: { type: "number" },
        },
        required: ["totalVolume", "weightedConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "concentrations",
            label: "Concentrations",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "volumes",
            label: "Volumes",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "totalVolume",
            label: "Total Volume",
            valueType: { type: "number" },
          },
          {
            id: "weightedConcentration",
            label: "Weighted Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = remediationFlowWeightedConcentrationTermTool.execute;
export default remediationFlowWeightedConcentrationTermTool;
