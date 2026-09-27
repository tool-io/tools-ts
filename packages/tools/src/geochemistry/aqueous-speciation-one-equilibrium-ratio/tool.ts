import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logEquilibriumConstant: number;
  readonly reactantActivity: number;
  readonly ligandActivity: number;
  readonly ligandPower: number;
};
export type Output = {
  readonly productActivity: number;
  readonly productReactantRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logEquilibriumConstant: { type: "number" },
    reactantActivity: { type: "number", minimum: 0 },
    ligandActivity: { type: "number", minimum: 0 },
    ligandPower: { type: "integer", minimum: 0 },
  },
  required: [
    "logEquilibriumConstant",
    "reactantActivity",
    "ligandActivity",
    "ligandPower",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productActivity: { type: "number" },
    productReactantRatio: { type: "number" },
  },
  required: ["productActivity", "productReactantRatio"],
} as const;
/** One activity-based complexation mass-action term; ligand is free activity and mass-balance speciation is not solved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    logEquilibriumConstant,
    reactantActivity,
    ligandActivity,
    ligandPower,
  } = request;
  const compute = (): Output => {
    H.domain(reactantActivity >= 0 && ligandActivity >= 0);
    H.integer(ligandPower, 0);
    return {
      productActivity:
        10 ** logEquilibriumConstant *
        reactantActivity *
        ligandActivity ** ligandPower,
      productReactantRatio:
        10 ** logEquilibriumConstant * ligandActivity ** ligandPower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    logEquilibriumConstant: 2,
    reactantActivity: 0.01,
    ligandActivity: 0.1,
    ligandPower: 2,
  },
  output: {
    productActivity: 0.010000000000000002,
    productReactantRatio: 1.0000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const aqueousSpeciationOneEquilibriumRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/aqueous-speciation-one-equilibrium-ratio",
      title: "Aqueous Speciation One Equilibrium Ratio Tool",
      description:
        "One activity-based complexation mass-action term; ligand is free activity and mass-balance speciation is not solved.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          logEquilibriumConstant: { type: "number" },
          reactantActivity: { type: "number", minimum: 0 },
          ligandActivity: { type: "number", minimum: 0 },
          ligandPower: { type: "integer", minimum: 0 },
        },
        required: [
          "logEquilibriumConstant",
          "reactantActivity",
          "ligandActivity",
          "ligandPower",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          productActivity: { type: "number" },
          productReactantRatio: { type: "number" },
        },
        required: ["productActivity", "productReactantRatio"],
      },
      ports: {
        inputs: [
          {
            id: "logEquilibriumConstant",
            label: "Log Equilibrium Constant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reactantActivity",
            label: "Reactant Activity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ligandActivity",
            label: "Ligand Activity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ligandPower",
            label: "Ligand Power",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "productActivity",
            label: "Product Activity",
            valueType: { type: "number" },
          },
          {
            id: "productReactantRatio",
            label: "Product Reactant Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aqueousSpeciationOneEquilibriumRatioTool.execute;
export default aqueousSpeciationOneEquilibriumRatioTool;
