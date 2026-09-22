import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetVolume: number;
  readonly vaporPressure: number;
  readonly totalPressure: number;
};
export type Output = {
  readonly dryFraction: number;
  readonly dryVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetVolume: { type: "number", minimum: 0 },
    vaporPressure: { type: "number", minimum: 0 },
    totalPressure: { type: "number" },
  },
  required: ["wetVolume", "vaporPressure", "totalPressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryFraction: { type: "number" },
    dryVolume: { type: "number" },
  },
  required: ["dryFraction", "dryVolume"],
} as const;
/** Remove the water-vapor mole fraction at unchanged temperature and total pressure under ideal-gas behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetVolume, vaporPressure, totalPressure } = request;
  const compute = (): Output => {
    H.domain(
      wetVolume >= 0 && vaporPressure >= 0 && totalPressure > vaporPressure,
    );
    return {
      dryFraction: 1 - vaporPressure / totalPressure,
      dryVolume: wetVolume * (1 - vaporPressure / totalPressure),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetVolume: 100, vaporPressure: 2, totalPressure: 100 },
  output: { dryFraction: 0.98, dryVolume: 98 },
} satisfies ToolExample<Input, Output>;
export const gasSampleHumidityVolumeCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/gas-sample-humidity-volume-correction",
    title: "Gas Sample Humidity Volume Correction Tool",
    description:
      "Remove the water-vapor mole fraction at unchanged temperature and total pressure under ideal-gas behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetVolume: { type: "number", minimum: 0 },
        vaporPressure: { type: "number", minimum: 0 },
        totalPressure: { type: "number" },
      },
      required: ["wetVolume", "vaporPressure", "totalPressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryFraction: { type: "number" },
        dryVolume: { type: "number" },
      },
      required: ["dryFraction", "dryVolume"],
    },
    ports: {
      inputs: [
        {
          id: "wetVolume",
          label: "Wet Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "vaporPressure",
          label: "Vapor Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPressure",
          label: "Total Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryFraction",
          label: "Dry Fraction",
          valueType: { type: "number" },
        },
        { id: "dryVolume", label: "Dry Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gasSampleHumidityVolumeCorrectionTool.execute;
export default gasSampleHumidityVolumeCorrectionTool;
