import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preyDensity: number;
  readonly attackRate: number;
  readonly handlingTime: number;
  readonly predators: number;
};
export type Output = {
  readonly perPredatorRate: number;
  readonly totalConsumptionRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preyDensity: { type: "number", minimum: 0 },
    attackRate: { type: "number", minimum: 0 },
    handlingTime: { type: "number", minimum: 0 },
    predators: { type: "number", minimum: 0 },
  },
  required: ["preyDensity", "attackRate", "handlingTime", "predators"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perPredatorRate: { type: "number" },
    totalConsumptionRate: { type: "number" },
  },
  required: ["perPredatorRate", "totalConsumptionRate"],
} as const;
/** Holling type II instantaneous rate with caller-supplied parameters; depletion during a finite feeding interval is excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preyDensity, attackRate, handlingTime, predators } = request;
  const compute = (): Output => {
    H.domain(
      preyDensity >= 0 &&
        attackRate >= 0 &&
        handlingTime >= 0 &&
        predators >= 0,
    );
    const perPredatorRate =
      (attackRate * preyDensity) /
      (1 + attackRate * handlingTime * preyDensity);
    return {
      perPredatorRate,
      totalConsumptionRate: predators * perPredatorRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preyDensity: 10, attackRate: 0.2, handlingTime: 0.5, predators: 3 },
  output: { perPredatorRate: 1, totalConsumptionRate: 3 },
} satisfies ToolExample<Input, Output>;
export const predatorFunctionalResponseOnePreyPointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "computational-biology/predator-functional-response-one-prey-point",
      title: "Predator Functional Response One Prey Point Tool",
      description:
        "Holling type II instantaneous rate with caller-supplied parameters; depletion during a finite feeding interval is excluded.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          preyDensity: { type: "number", minimum: 0 },
          attackRate: { type: "number", minimum: 0 },
          handlingTime: { type: "number", minimum: 0 },
          predators: { type: "number", minimum: 0 },
        },
        required: ["preyDensity", "attackRate", "handlingTime", "predators"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          perPredatorRate: { type: "number" },
          totalConsumptionRate: { type: "number" },
        },
        required: ["perPredatorRate", "totalConsumptionRate"],
      },
      ports: {
        inputs: [
          {
            id: "preyDensity",
            label: "Prey Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "attackRate",
            label: "Attack Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "handlingTime",
            label: "Handling Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "predators",
            label: "Predators",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "perPredatorRate",
            label: "Per Predator Rate",
            valueType: { type: "number" },
          },
          {
            id: "totalConsumptionRate",
            label: "Total Consumption Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = predatorFunctionalResponseOnePreyPointTool.execute;
export default predatorFunctionalResponseOnePreyPointTool;
