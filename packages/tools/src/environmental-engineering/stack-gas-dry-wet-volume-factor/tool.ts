import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetVolume: number;
  readonly waterVaporFraction: number;
  readonly wetConcentration: number;
};
export type Output = {
  readonly dryVolume: number;
  readonly dryConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetVolume: { type: "number", minimum: 0 },
    waterVaporFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    wetConcentration: { type: "number" },
  },
  required: ["wetVolume", "waterVaporFraction", "wetConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryVolume: { type: "number" },
    dryConcentration: { type: "number" },
  },
  required: ["dryVolume", "dryConcentration"],
} as const;
/** Dry/wet concentration correction at matching pressure and temperature with a volume-basis water-vapor fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetVolume, waterVaporFraction, wetConcentration } = request;
  const compute = (): Output => {
    H.domain(
      wetVolume >= 0 && waterVaporFraction >= 0 && waterVaporFraction < 1,
    );
    return {
      dryVolume: wetVolume * (1 - waterVaporFraction),
      dryConcentration: wetConcentration / (1 - waterVaporFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetVolume: 100, waterVaporFraction: 0.2, wetConcentration: 40 },
  output: { dryVolume: 80, dryConcentration: 50 },
} satisfies ToolExample<Input, Output>;
export const stackGasDryWetVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/stack-gas-dry-wet-volume-factor",
    title: "Stack Gas Dry Wet Volume Factor Tool",
    description:
      "Dry/wet concentration correction at matching pressure and temperature with a volume-basis water-vapor fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetVolume: { type: "number", minimum: 0 },
        waterVaporFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        wetConcentration: { type: "number" },
      },
      required: ["wetVolume", "waterVaporFraction", "wetConcentration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryVolume: { type: "number" },
        dryConcentration: { type: "number" },
      },
      required: ["dryVolume", "dryConcentration"],
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
          id: "waterVaporFraction",
          label: "Water Vapor Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetConcentration",
          label: "Wet Concentration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryVolume", label: "Dry Volume", valueType: { type: "number" } },
        {
          id: "dryConcentration",
          label: "Dry Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stackGasDryWetVolumeFactorTool.execute;
export default stackGasDryWetVolumeFactorTool;
