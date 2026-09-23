import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conductance: number;
  readonly membraneVolts: number;
  readonly reversalVolts: number;
  readonly measuredCurrent: number;
};
export type Output = {
  readonly drivingVoltage: number;
  readonly predictedCurrent: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductance: { type: "number", minimum: 0 },
    membraneVolts: { type: "number" },
    reversalVolts: { type: "number" },
    measuredCurrent: { type: "number" },
  },
  required: [
    "conductance",
    "membraneVolts",
    "reversalVolts",
    "measuredCurrent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drivingVoltage: { type: "number" },
    predictedCurrent: { type: "number" },
    residual: { type: "number" },
  },
  required: ["drivingVoltage", "predictedCurrent", "residual"],
} as const;
/** Ohmic current with outward-positive g*(Vm-Erev); consistent SI conductance yields amperes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conductance, membraneVolts, reversalVolts, measuredCurrent } =
    request;
  const compute = (): Output => {
    H.domain(conductance >= 0);
    return {
      drivingVoltage: membraneVolts - reversalVolts,
      predictedCurrent: conductance * (membraneVolts - reversalVolts),
      residual: measuredCurrent - conductance * (membraneVolts - reversalVolts),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    conductance: 2,
    membraneVolts: 0.03,
    reversalVolts: -0.02,
    measuredCurrent: 0.12,
  },
  output: {
    drivingVoltage: 0.05,
    predictedCurrent: 0.1,
    residual: 0.01999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const ionChannelConductanceCurrentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/ion-channel-conductance-current-gap",
    title: "Ion Channel Conductance Current Gap Tool",
    description:
      "Ohmic current with outward-positive g*(Vm-Erev); consistent SI conductance yields amperes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conductance: { type: "number", minimum: 0 },
        membraneVolts: { type: "number" },
        reversalVolts: { type: "number" },
        measuredCurrent: { type: "number" },
      },
      required: [
        "conductance",
        "membraneVolts",
        "reversalVolts",
        "measuredCurrent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drivingVoltage: { type: "number" },
        predictedCurrent: { type: "number" },
        residual: { type: "number" },
      },
      required: ["drivingVoltage", "predictedCurrent", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "conductance",
          label: "Conductance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "membraneVolts",
          label: "Membrane Volts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reversalVolts",
          label: "Reversal Volts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredCurrent",
          label: "Measured Current",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "drivingVoltage",
          label: "Driving Voltage",
          valueType: { type: "number" },
        },
        {
          id: "predictedCurrent",
          label: "Predicted Current",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ionChannelConductanceCurrentGapTool.execute;
export default ionChannelConductanceCurrentGapTool;
