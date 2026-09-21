import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly planted: number;
  readonly failed: number;
  readonly materialPerPlant: number;
  readonly laborPerPlant: number;
  readonly fixedMobilization: number;
};
export type Output = {
  readonly failureFraction: number;
  readonly replantCost: number;
  readonly costPerOriginalPlant: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    planted: { type: "integer", minimum: 1 },
    failed: { type: "integer", minimum: 0 },
    materialPerPlant: { type: "number", minimum: 0 },
    laborPerPlant: { type: "number", minimum: 0 },
    fixedMobilization: { type: "number", minimum: 0 },
  },
  required: [
    "planted",
    "failed",
    "materialPerPlant",
    "laborPerPlant",
    "fixedMobilization",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    failureFraction: { type: "number" },
    replantCost: { type: "number" },
    costPerOriginalPlant: { type: "number" },
  },
  required: ["failureFraction", "replantCost", "costPerOriginalPlant"],
} as const;
/** Calculate perennial establishment failure replant cost term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    planted,
    failed,
    materialPerPlant,
    laborPerPlant,
    fixedMobilization,
  } = request;
  const compute = (): Output => {
    H.integer(planted, 1);
    H.integer(failed, 0, planted);
    H.domain(
      materialPerPlant >= 0 && laborPerPlant >= 0 && fixedMobilization >= 0,
    );
    return {
      failureFraction: failed / planted,
      replantCost:
        failed === 0
          ? 0
          : failed * (materialPerPlant + laborPerPlant) + fixedMobilization,
      costPerOriginalPlant:
        (failed === 0
          ? 0
          : failed * (materialPerPlant + laborPerPlant) + fixedMobilization) /
        planted,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    planted: 100,
    failed: 10,
    materialPerPlant: 5,
    laborPerPlant: 3,
    fixedMobilization: 20,
  },
  output: { failureFraction: 0.1, replantCost: 100, costPerOriginalPlant: 1 },
} satisfies ToolExample<Input, Output>;
export const perennialEstablishmentFailureReplantCostTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-economics/perennial-establishment-failure-replant-cost-term",
      title: "Perennial Establishment Failure Replant Cost Term Tool",
      description:
        "Calculate perennial establishment failure replant cost term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          planted: { type: "integer", minimum: 1 },
          failed: { type: "integer", minimum: 0 },
          materialPerPlant: { type: "number", minimum: 0 },
          laborPerPlant: { type: "number", minimum: 0 },
          fixedMobilization: { type: "number", minimum: 0 },
        },
        required: [
          "planted",
          "failed",
          "materialPerPlant",
          "laborPerPlant",
          "fixedMobilization",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          failureFraction: { type: "number" },
          replantCost: { type: "number" },
          costPerOriginalPlant: { type: "number" },
        },
        required: ["failureFraction", "replantCost", "costPerOriginalPlant"],
      },
      ports: {
        inputs: [
          {
            id: "planted",
            label: "Planted",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "failed",
            label: "Failed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "materialPerPlant",
            label: "Material Per Plant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "laborPerPlant",
            label: "Labor Per Plant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fixedMobilization",
            label: "Fixed Mobilization",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "failureFraction",
            label: "Failure Fraction",
            valueType: { type: "number" },
          },
          {
            id: "replantCost",
            label: "Replant Cost",
            valueType: { type: "number" },
          },
          {
            id: "costPerOriginalPlant",
            label: "Cost Per Original Plant",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = perennialEstablishmentFailureReplantCostTermTool.execute;
export default perennialEstablishmentFailureReplantCostTermTool;
