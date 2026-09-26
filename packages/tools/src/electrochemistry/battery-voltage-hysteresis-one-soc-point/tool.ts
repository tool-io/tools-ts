import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chargeVoltage: number;
  readonly dischargeVoltage: number;
  readonly chargeSoc: number;
  readonly dischargeSoc: number;
  readonly tolerance: number;
};
export type Output = {
  readonly hysteresis: number;
  readonly midpoint: number;
  readonly comparable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chargeVoltage: { type: "number" },
    dischargeVoltage: { type: "number" },
    chargeSoc: { type: "number", minimum: 0, maximum: 1 },
    dischargeSoc: { type: "number", minimum: 0, maximum: 1 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: [
    "chargeVoltage",
    "dischargeVoltage",
    "chargeSoc",
    "dischargeSoc",
    "tolerance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hysteresis: { type: "number" },
    midpoint: { type: "number" },
    comparable: { type: "boolean" },
  },
  required: ["hysteresis", "midpoint", "comparable"],
} as const;
/** Calculate battery voltage hysteresis one soc point from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    chargeVoltage,
    dischargeVoltage,
    chargeSoc,
    dischargeSoc,
    tolerance,
  } = request;
  const compute = (): Output => {
    H.probability(chargeSoc);
    H.probability(dischargeSoc);
    H.domain(tolerance >= 0);
    return {
      hysteresis: chargeVoltage - dischargeVoltage,
      midpoint: (chargeVoltage + dischargeVoltage) / 2,
      comparable: Math.abs(chargeSoc - dischargeSoc) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    chargeVoltage: 4,
    dischargeVoltage: 3.8,
    chargeSoc: 0.5,
    dischargeSoc: 0.5,
    tolerance: 0.01,
  },
  output: { hysteresis: 0.20000000000000018, midpoint: 3.9, comparable: true },
} satisfies ToolExample<Input, Output>;
export const batteryVoltageHysteresisOneSocPointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/battery-voltage-hysteresis-one-soc-point",
      title: "Battery Voltage Hysteresis One Soc Point Tool",
      description:
        "Calculate battery voltage hysteresis one soc point from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          chargeVoltage: { type: "number" },
          dischargeVoltage: { type: "number" },
          chargeSoc: { type: "number", minimum: 0, maximum: 1 },
          dischargeSoc: { type: "number", minimum: 0, maximum: 1 },
          tolerance: { type: "number", minimum: 0 },
        },
        required: [
          "chargeVoltage",
          "dischargeVoltage",
          "chargeSoc",
          "dischargeSoc",
          "tolerance",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hysteresis: { type: "number" },
          midpoint: { type: "number" },
          comparable: { type: "boolean" },
        },
        required: ["hysteresis", "midpoint", "comparable"],
      },
      ports: {
        inputs: [
          {
            id: "chargeVoltage",
            label: "Charge Voltage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dischargeVoltage",
            label: "Discharge Voltage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "chargeSoc",
            label: "Charge Soc",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dischargeSoc",
            label: "Discharge Soc",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tolerance",
            label: "Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "hysteresis",
            label: "Hysteresis",
            valueType: { type: "number" },
          },
          { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
          {
            id: "comparable",
            label: "Comparable",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = batteryVoltageHysteresisOneSocPointTool.execute;
export default batteryVoltageHysteresisOneSocPointTool;
