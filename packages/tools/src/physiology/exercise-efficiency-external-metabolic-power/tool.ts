import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly externalPower: number;
  readonly grossMetabolicPower: number;
  readonly restingMetabolicPower: number;
};
export type Output = {
  readonly grossEfficiency: number;
  readonly netEfficiency: number;
  readonly netMetabolicPower: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    externalPower: { type: "number", minimum: 0 },
    grossMetabolicPower: { type: "number" },
    restingMetabolicPower: { type: "number", minimum: 0 },
  },
  required: ["externalPower", "grossMetabolicPower", "restingMetabolicPower"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossEfficiency: { type: "number" },
    netEfficiency: { type: "number" },
    netMetabolicPower: { type: "number" },
  },
  required: ["grossEfficiency", "netEfficiency", "netMetabolicPower"],
} as const;
/** Calculate exercise efficiency external metabolic power from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { externalPower, grossMetabolicPower, restingMetabolicPower } = request;
  const compute = (): Output => {
    H.domain(
      externalPower >= 0 &&
        restingMetabolicPower >= 0 &&
        grossMetabolicPower > restingMetabolicPower,
    );
    return {
      grossEfficiency: externalPower / grossMetabolicPower,
      netEfficiency:
        externalPower / (grossMetabolicPower - restingMetabolicPower),
      netMetabolicPower: grossMetabolicPower - restingMetabolicPower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    externalPower: 100,
    grossMetabolicPower: 500,
    restingMetabolicPower: 100,
  },
  output: { grossEfficiency: 0.2, netEfficiency: 0.25, netMetabolicPower: 400 },
} satisfies ToolExample<Input, Output>;
export const exerciseEfficiencyExternalMetabolicPowerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physiology/exercise-efficiency-external-metabolic-power",
      title: "Exercise Efficiency External Metabolic Power Tool",
      description:
        "Calculate exercise efficiency external metabolic power from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          externalPower: { type: "number", minimum: 0 },
          grossMetabolicPower: { type: "number" },
          restingMetabolicPower: { type: "number", minimum: 0 },
        },
        required: [
          "externalPower",
          "grossMetabolicPower",
          "restingMetabolicPower",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossEfficiency: { type: "number" },
          netEfficiency: { type: "number" },
          netMetabolicPower: { type: "number" },
        },
        required: ["grossEfficiency", "netEfficiency", "netMetabolicPower"],
      },
      ports: {
        inputs: [
          {
            id: "externalPower",
            label: "External Power",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "grossMetabolicPower",
            label: "Gross Metabolic Power",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "restingMetabolicPower",
            label: "Resting Metabolic Power",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "grossEfficiency",
            label: "Gross Efficiency",
            valueType: { type: "number" },
          },
          {
            id: "netEfficiency",
            label: "Net Efficiency",
            valueType: { type: "number" },
          },
          {
            id: "netMetabolicPower",
            label: "Net Metabolic Power",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = exerciseEfficiencyExternalMetabolicPowerTool.execute;
export default exerciseEfficiencyExternalMetabolicPowerTool;
