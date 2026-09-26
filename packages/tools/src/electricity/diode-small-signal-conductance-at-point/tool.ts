import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forwardCurrent: number;
  readonly saturationCurrent: number;
  readonly ideality: number;
  readonly thermalVoltage: number;
};
export type Output = {
  readonly conductance: number;
  readonly resistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardCurrent: { type: "number" },
    saturationCurrent: { type: "number", minimum: 0 },
    ideality: { type: "number", exclusiveMinimum: 0 },
    thermalVoltage: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "forwardCurrent",
    "saturationCurrent",
    "ideality",
    "thermalVoltage",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductance: { type: "number" },
    resistance: { type: "number" },
  },
  required: ["conductance", "resistance"],
} as const;
/** Differentiate the ideal Shockley equation at an explicit operating point, including the saturation-current term. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forwardCurrent, saturationCurrent, ideality, thermalVoltage } =
    request;
  const compute = (): Output => {
    H.domain(saturationCurrent >= 0 && forwardCurrent + saturationCurrent > 0);
    H.positive(ideality);
    H.positive(thermalVoltage);
    const conductance =
      (forwardCurrent + saturationCurrent) / (ideality * thermalVoltage);
    return { conductance, resistance: 1 / conductance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    forwardCurrent: 0.001,
    saturationCurrent: 0.000001,
    ideality: 2,
    thermalVoltage: 0.025,
  },
  output: { conductance: 0.020019999999999996, resistance: 49.95004995004996 },
} satisfies ToolExample<Input, Output>;
export const diodeSmallSignalConductanceAtPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/diode-small-signal-conductance-at-point",
    title: "Diode Small Signal Conductance At Point Tool",
    description:
      "Differentiate the ideal Shockley equation at an explicit operating point, including the saturation-current term.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forwardCurrent: { type: "number" },
        saturationCurrent: { type: "number", minimum: 0 },
        ideality: { type: "number", exclusiveMinimum: 0 },
        thermalVoltage: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "forwardCurrent",
        "saturationCurrent",
        "ideality",
        "thermalVoltage",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conductance: { type: "number" },
        resistance: { type: "number" },
      },
      required: ["conductance", "resistance"],
    },
    ports: {
      inputs: [
        {
          id: "forwardCurrent",
          label: "Forward Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "saturationCurrent",
          label: "Saturation Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ideality",
          label: "Ideality",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thermalVoltage",
          label: "Thermal Voltage",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "conductance",
          label: "Conductance",
          valueType: { type: "number" },
        },
        {
          id: "resistance",
          label: "Resistance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = diodeSmallSignalConductanceAtPointTool.execute;
export default diodeSmallSignalConductanceAtPointTool;
