import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inletSpecificEnthalpy: number;
  readonly outletLiquidEnthalpy: number;
  readonly outletVaporEnthalpy: number;
  readonly massFlow: number;
};
export type Output = {
  readonly rawVaporFraction: number;
  readonly vaporMassFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletSpecificEnthalpy: { type: "number" },
    outletLiquidEnthalpy: { type: "number" },
    outletVaporEnthalpy: { type: "number" },
    massFlow: { type: "number", minimum: 0 },
  },
  required: [
    "inletSpecificEnthalpy",
    "outletLiquidEnthalpy",
    "outletVaporEnthalpy",
    "massFlow",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawVaporFraction: { type: "number" },
    vaporMassFlow: { type: "number" },
  },
  required: ["rawVaporFraction", "vaporMassFlow"],
} as const;
/** Isenthalpic two-phase lever-rule fraction; raw values outside 0..1 flag a state outside the supplied saturation-enthalpy interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    inletSpecificEnthalpy,
    outletLiquidEnthalpy,
    outletVaporEnthalpy,
    massFlow,
  } = request;
  const compute = (): Output => {
    H.domain(outletVaporEnthalpy > outletLiquidEnthalpy && massFlow >= 0);
    return {
      rawVaporFraction:
        (inletSpecificEnthalpy - outletLiquidEnthalpy) /
        (outletVaporEnthalpy - outletLiquidEnthalpy),
      vaporMassFlow:
        (massFlow * (inletSpecificEnthalpy - outletLiquidEnthalpy)) /
        (outletVaporEnthalpy - outletLiquidEnthalpy),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inletSpecificEnthalpy: 120,
    outletLiquidEnthalpy: 100,
    outletVaporEnthalpy: 300,
    massFlow: 10,
  },
  output: { rawVaporFraction: 0.1, vaporMassFlow: 1 },
} satisfies ToolExample<Input, Output>;
export const cryogenicTransferLineFlashFractionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cryogenics/cryogenic-transfer-line-flash-fraction-term",
      title: "Cryogenic Transfer Line Flash Fraction Term Tool",
      description:
        "Isenthalpic two-phase lever-rule fraction; raw values outside 0..1 flag a state outside the supplied saturation-enthalpy interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inletSpecificEnthalpy: { type: "number" },
          outletLiquidEnthalpy: { type: "number" },
          outletVaporEnthalpy: { type: "number" },
          massFlow: { type: "number", minimum: 0 },
        },
        required: [
          "inletSpecificEnthalpy",
          "outletLiquidEnthalpy",
          "outletVaporEnthalpy",
          "massFlow",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawVaporFraction: { type: "number" },
          vaporMassFlow: { type: "number" },
        },
        required: ["rawVaporFraction", "vaporMassFlow"],
      },
      ports: {
        inputs: [
          {
            id: "inletSpecificEnthalpy",
            label: "Inlet Specific Enthalpy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outletLiquidEnthalpy",
            label: "Outlet Liquid Enthalpy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outletVaporEnthalpy",
            label: "Outlet Vapor Enthalpy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "massFlow",
            label: "Mass Flow",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "rawVaporFraction",
            label: "Raw Vapor Fraction",
            valueType: { type: "number" },
          },
          {
            id: "vaporMassFlow",
            label: "Vapor Mass Flow",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cryogenicTransferLineFlashFractionTermTool.execute;
export default cryogenicTransferLineFlashFractionTermTool;
