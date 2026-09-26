import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initial: number;
  readonly equilibrium: number;
  readonly airChangesPerHour: number;
  readonly hours: number;
};
export type Output = {
  readonly remainingFraction: number;
  readonly finalConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "number", minimum: 0 },
    equilibrium: { type: "number", minimum: 0 },
    airChangesPerHour: { type: "number", minimum: 0 },
    hours: { type: "number", minimum: 0 },
  },
  required: ["initial", "equilibrium", "airChangesPerHour", "hours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingFraction: { type: "number" },
    finalConcentration: { type: "number" },
  },
  required: ["remainingFraction", "finalConcentration"],
} as const;
/** Ideal well-mixed removal toward a supplied equilibrium concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, equilibrium, airChangesPerHour, hours } = request;
  const compute = (): Output => {
    H.domain(
      initial >= 0 && equilibrium >= 0 && airChangesPerHour >= 0 && hours >= 0,
    );
    return {
      remainingFraction: Math.exp(-airChangesPerHour * hours),
      finalConcentration:
        equilibrium +
        (initial - equilibrium) * Math.exp(-airChangesPerHour * hours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initial: 100, equilibrium: 10, airChangesPerHour: 2, hours: 0.5 },
  output: {
    remainingFraction: 0.36787944117144233,
    finalConcentration: 43.10914970542981,
  },
} satisfies ToolExample<Input, Output>;
export const indoorAirChangeExponentialRemovalTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-health/indoor-air-change-exponential-removal-term",
      title: "Indoor Air Change Exponential Removal Term Tool",
      description:
        "Ideal well-mixed removal toward a supplied equilibrium concentration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initial: { type: "number", minimum: 0 },
          equilibrium: { type: "number", minimum: 0 },
          airChangesPerHour: { type: "number", minimum: 0 },
          hours: { type: "number", minimum: 0 },
        },
        required: ["initial", "equilibrium", "airChangesPerHour", "hours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingFraction: { type: "number" },
          finalConcentration: { type: "number" },
        },
        required: ["remainingFraction", "finalConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "initial",
            label: "Initial",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "equilibrium",
            label: "Equilibrium",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "airChangesPerHour",
            label: "Air Changes Per Hour",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "hours",
            label: "Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingFraction",
            label: "Remaining Fraction",
            valueType: { type: "number" },
          },
          {
            id: "finalConcentration",
            label: "Final Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = indoorAirChangeExponentialRemovalTermTool.execute;
export default indoorAirChangeExponentialRemovalTermTool;
