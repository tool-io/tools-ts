import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly standardFreeEnergy: number;
  readonly gasConstant: number;
  readonly temperatureK: number;
  readonly reactionQuotient: number;
};
export type Output = {
  readonly freeEnergy: number;
  readonly equilibriumConstant: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardFreeEnergy: { type: "number" },
    gasConstant: { type: "number", exclusiveMinimum: 0 },
    temperatureK: { type: "number", exclusiveMinimum: 0 },
    reactionQuotient: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "standardFreeEnergy",
    "gasConstant",
    "temperatureK",
    "reactionQuotient",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeEnergy: { type: "number" },
    equilibriumConstant: { type: "number" },
  },
  required: ["freeEnergy", "equilibriumConstant"],
} as const;
/** Use a dimensionless reaction quotient and a standard free energy on the same temperature and energy basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { standardFreeEnergy, gasConstant, temperatureK, reactionQuotient } =
    request;
  const compute = (): Output => {
    H.positive(gasConstant);
    H.positive(temperatureK);
    H.positive(reactionQuotient);
    return {
      freeEnergy:
        standardFreeEnergy +
        gasConstant * temperatureK * Math.log(reactionQuotient),
      equilibriumConstant: Math.exp(
        -standardFreeEnergy / (gasConstant * temperatureK),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    standardFreeEnergy: 0,
    gasConstant: 8,
    temperatureK: 300,
    reactionQuotient: 2,
  },
  output: { freeEnergy: 1663.5532333438687, equilibriumConstant: 1 },
} satisfies ToolExample<Input, Output>;
export const reactionEquilibriumFreeEnergyTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/reaction-equilibrium-free-energy-term",
    title: "Reaction Equilibrium Free Energy Term Tool",
    description:
      "Use a dimensionless reaction quotient and a standard free energy on the same temperature and energy basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        standardFreeEnergy: { type: "number" },
        gasConstant: { type: "number", exclusiveMinimum: 0 },
        temperatureK: { type: "number", exclusiveMinimum: 0 },
        reactionQuotient: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "standardFreeEnergy",
        "gasConstant",
        "temperatureK",
        "reactionQuotient",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freeEnergy: { type: "number" },
        equilibriumConstant: { type: "number" },
      },
      required: ["freeEnergy", "equilibriumConstant"],
    },
    ports: {
      inputs: [
        {
          id: "standardFreeEnergy",
          label: "Standard Free Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gasConstant",
          label: "Gas Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureK",
          label: "Temperature K",
          required: true,
          valueType: { type: "number", unit: "K" },
        },
        {
          id: "reactionQuotient",
          label: "Reaction Quotient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "freeEnergy",
          label: "Free Energy",
          valueType: { type: "number" },
        },
        {
          id: "equilibriumConstant",
          label: "Equilibrium Constant",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reactionEquilibriumFreeEnergyTermTool.execute;
export default reactionEquilibriumFreeEnergyTermTool;
