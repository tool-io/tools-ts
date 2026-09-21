import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly porosity: number;
  readonly initialWater: number;
  readonly waterChange: number;
};
export type Output = {
  readonly initialAir: number;
  readonly finalAir: number;
  readonly airChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    porosity: { type: "number", minimum: 0, maximum: 1 },
    initialWater: { type: "number", minimum: 0 },
    waterChange: { type: "number" },
  },
  required: ["porosity", "initialWater", "waterChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialAir: { type: "number" },
    finalAir: { type: "number" },
    airChange: { type: "number" },
  },
  required: ["initialAir", "finalAir", "airChange"],
} as const;
/** Air-filled pore-fraction sensitivity to one explicit water-content change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { porosity, initialWater, waterChange } = request;
  const compute = (): Output => {
    H.domain(
      porosity >= 0 &&
        porosity <= 1 &&
        initialWater >= 0 &&
        initialWater <= porosity &&
        initialWater + waterChange >= 0 &&
        initialWater + waterChange <= porosity,
    );
    return {
      initialAir: porosity - initialWater,
      finalAir: porosity - initialWater - waterChange,
      airChange: -waterChange,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { porosity: 0.5, initialWater: 0.2, waterChange: 0.1 },
  output: { initialAir: 0.3, finalAir: 0.19999999999999998, airChange: -0.1 },
} satisfies ToolExample<Input, Output>;
export const soilAirFilledPorosityMoistureSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrophysics/soil-air-filled-porosity-moisture-sensitivity",
      title: "Soil Air Filled Porosity Moisture Sensitivity Tool",
      description:
        "Air-filled pore-fraction sensitivity to one explicit water-content change.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          porosity: { type: "number", minimum: 0, maximum: 1 },
          initialWater: { type: "number", minimum: 0 },
          waterChange: { type: "number" },
        },
        required: ["porosity", "initialWater", "waterChange"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialAir: { type: "number" },
          finalAir: { type: "number" },
          airChange: { type: "number" },
        },
        required: ["initialAir", "finalAir", "airChange"],
      },
      ports: {
        inputs: [
          {
            id: "porosity",
            label: "Porosity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialWater",
            label: "Initial Water",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "waterChange",
            label: "Water Change",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "initialAir",
            label: "Initial Air",
            valueType: { type: "number" },
          },
          { id: "finalAir", label: "Final Air", valueType: { type: "number" } },
          {
            id: "airChange",
            label: "Air Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = soilAirFilledPorosityMoistureSensitivityTool.execute;
export default soilAirFilledPorosityMoistureSensitivityTool;
