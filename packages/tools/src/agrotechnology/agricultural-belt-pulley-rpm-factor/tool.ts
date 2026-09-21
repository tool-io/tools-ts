import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly driverRpm: number;
  readonly driverDiameter: number;
  readonly drivenDiameter: number;
  readonly beltSlip: number;
};
export type Output = { readonly drivenRpm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    driverRpm: { type: "number", minimum: 0 },
    driverDiameter: { type: "number", exclusiveMinimum: 0 },
    drivenDiameter: { type: "number", exclusiveMinimum: 0 },
    beltSlip: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["driverRpm", "driverDiameter", "drivenDiameter", "beltSlip"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { drivenRpm: { type: "number" } },
  required: ["drivenRpm"],
} as const;
/** Calculate agricultural belt pulley rpm factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { driverRpm, driverDiameter, drivenDiameter, beltSlip } = request;
  const compute = (): Output => {
    H.domain(driverRpm >= 0);
    H.positive(driverDiameter);
    H.positive(drivenDiameter);
    H.probability(beltSlip);
    return {
      drivenRpm: (driverRpm * driverDiameter * (1 - beltSlip)) / drivenDiameter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    driverRpm: 1000,
    driverDiameter: 10,
    drivenDiameter: 20,
    beltSlip: 0.1,
  },
  output: { drivenRpm: 450 },
} satisfies ToolExample<Input, Output>;
export const agriculturalBeltPulleyRpmFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/agricultural-belt-pulley-rpm-factor",
    title: "Agricultural Belt Pulley Rpm Factor Tool",
    description:
      "Calculate agricultural belt pulley rpm factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        driverRpm: { type: "number", minimum: 0 },
        driverDiameter: { type: "number", exclusiveMinimum: 0 },
        drivenDiameter: { type: "number", exclusiveMinimum: 0 },
        beltSlip: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["driverRpm", "driverDiameter", "drivenDiameter", "beltSlip"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { drivenRpm: { type: "number" } },
      required: ["drivenRpm"],
    },
    ports: {
      inputs: [
        {
          id: "driverRpm",
          label: "Driver Rpm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "driverDiameter",
          label: "Driver Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drivenDiameter",
          label: "Driven Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beltSlip",
          label: "Belt Slip",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "drivenRpm", label: "Driven Rpm", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = agriculturalBeltPulleyRpmFactorTool.execute;
export default agriculturalBeltPulleyRpmFactorTool;
