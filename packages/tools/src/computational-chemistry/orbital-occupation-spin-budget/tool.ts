import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alphaOccupations: readonly number[];
  readonly betaOccupations: readonly number[];
  readonly targetElectrons: number;
  readonly targetSpinDifference: number;
};
export type Output = {
  readonly electrons: number;
  readonly spinDifference: number;
  readonly electronDeficit: number;
  readonly spinDeficit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alphaOccupations: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    betaOccupations: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    targetElectrons: { type: "integer", minimum: 0 },
    targetSpinDifference: { type: "integer" },
  },
  required: [
    "alphaOccupations",
    "betaOccupations",
    "targetElectrons",
    "targetSpinDifference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    electrons: { type: "integer" },
    spinDifference: { type: "integer" },
    electronDeficit: { type: "integer" },
    spinDeficit: { type: "integer" },
  },
  required: ["electrons", "spinDifference", "electronDeficit", "spinDeficit"],
} as const;
/** Sum per-orbital alpha/beta occupancies and compare supplied electron/spin budgets; no spin-state assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    alphaOccupations,
    betaOccupations,
    targetElectrons,
    targetSpinDifference,
  } = request;
  const compute = (): Output => {
    H.sameLength(alphaOccupations, betaOccupations);
    H.domain(
      [...alphaOccupations, ...betaOccupations].every(
        (x) => x === 0 || x === 1,
      ),
    );
    H.integer(targetElectrons, 0);
    return {
      electrons:
        alphaOccupations.reduce((a, b) => a + b, 0) +
        betaOccupations.reduce((a, b) => a + b, 0),
      spinDifference:
        alphaOccupations.reduce((a, b) => a + b, 0) -
        betaOccupations.reduce((a, b) => a + b, 0),
      electronDeficit:
        targetElectrons -
        alphaOccupations.reduce((a, b) => a + b, 0) -
        betaOccupations.reduce((a, b) => a + b, 0),
      spinDeficit:
        targetSpinDifference -
        alphaOccupations.reduce((a, b) => a + b, 0) +
        betaOccupations.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    alphaOccupations: [1, 1, 0],
    betaOccupations: [1, 0, 0],
    targetElectrons: 4,
    targetSpinDifference: 0,
  },
  output: {
    electrons: 3,
    spinDifference: 1,
    electronDeficit: 1,
    spinDeficit: -1,
  },
} satisfies ToolExample<Input, Output>;
export const orbitalOccupationSpinBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/orbital-occupation-spin-budget",
    title: "Orbital Occupation Spin Budget Tool",
    description:
      "Sum per-orbital alpha/beta occupancies and compare supplied electron/spin budgets; no spin-state assignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alphaOccupations: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        betaOccupations: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        targetElectrons: { type: "integer", minimum: 0 },
        targetSpinDifference: { type: "integer" },
      },
      required: [
        "alphaOccupations",
        "betaOccupations",
        "targetElectrons",
        "targetSpinDifference",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        electrons: { type: "integer" },
        spinDifference: { type: "integer" },
        electronDeficit: { type: "integer" },
        spinDeficit: { type: "integer" },
      },
      required: [
        "electrons",
        "spinDifference",
        "electronDeficit",
        "spinDeficit",
      ],
    },
    ports: {
      inputs: [
        {
          id: "alphaOccupations",
          label: "Alpha Occupations",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "betaOccupations",
          label: "Beta Occupations",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "targetElectrons",
          label: "Target Electrons",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetSpinDifference",
          label: "Target Spin Difference",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "electrons", label: "Electrons", valueType: { type: "integer" } },
        {
          id: "spinDifference",
          label: "Spin Difference",
          valueType: { type: "integer" },
        },
        {
          id: "electronDeficit",
          label: "Electron Deficit",
          valueType: { type: "integer" },
        },
        {
          id: "spinDeficit",
          label: "Spin Deficit",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = orbitalOccupationSpinBudgetTool.execute;
export default orbitalOccupationSpinBudgetTool;
