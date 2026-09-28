import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterDensity: number;
  readonly gravity: number;
  readonly discharge: number;
  readonly energySlope: number;
  readonly width: number;
};
export type Output = {
  readonly totalPowerPerLength: number;
  readonly powerPerBedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterDensity: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    discharge: { type: "number", minimum: 0 },
    energySlope: { type: "number", minimum: 0 },
    width: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["waterDensity", "gravity", "discharge", "energySlope", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPowerPerLength: { type: "number" },
    powerPerBedArea: { type: "number" },
  },
  required: ["totalPowerPerLength", "powerPerBedArea"],
} as const;
/** SI stream power rho*g*Q*S in W/m and width-normalized power in W/m2. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterDensity, gravity, discharge, energySlope, width } = request;
  const compute = (): Output => {
    H.positive(waterDensity);
    H.positive(gravity);
    H.domain(discharge >= 0 && energySlope >= 0);
    H.positive(width);
    return {
      totalPowerPerLength: waterDensity * gravity * discharge * energySlope,
      powerPerBedArea:
        (waterDensity * gravity * discharge * energySlope) / width,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    waterDensity: 1000,
    gravity: 9.8,
    discharge: 10,
    energySlope: 0.01,
    width: 5,
  },
  output: { totalPowerPerLength: 980, powerPerBedArea: 196 },
} satisfies ToolExample<Input, Output>;
export const streamPowerUnitWidthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/stream-power-unit-width-term",
    title: "Stream Power Unit Width Term Tool",
    description:
      "SI stream power rho*g*Q*S in W/m and width-normalized power in W/m2.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterDensity: { type: "number", exclusiveMinimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
        discharge: { type: "number", minimum: 0 },
        energySlope: { type: "number", minimum: 0 },
        width: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "waterDensity",
        "gravity",
        "discharge",
        "energySlope",
        "width",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPowerPerLength: { type: "number" },
        powerPerBedArea: { type: "number" },
      },
      required: ["totalPowerPerLength", "powerPerBedArea"],
    },
    ports: {
      inputs: [
        {
          id: "waterDensity",
          label: "Water Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discharge",
          label: "Discharge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "energySlope",
          label: "Energy Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalPowerPerLength",
          label: "Total Power Per Length",
          valueType: { type: "number" },
        },
        {
          id: "powerPerBedArea",
          label: "Power Per Bed Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = streamPowerUnitWidthTermTool.execute;
export default streamPowerUnitWidthTermTool;
