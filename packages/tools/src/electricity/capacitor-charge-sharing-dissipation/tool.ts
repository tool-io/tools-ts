import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCapacitance: number;
  readonly secondCapacitance: number;
  readonly firstVoltage: number;
  readonly secondVoltage: number;
};
export type Output = {
  readonly dissipatedEnergy: number;
  readonly finalVoltage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCapacitance: { type: "number", exclusiveMinimum: 0 },
    secondCapacitance: { type: "number", exclusiveMinimum: 0 },
    firstVoltage: { type: "number" },
    secondVoltage: { type: "number" },
  },
  required: [
    "firstCapacitance",
    "secondCapacitance",
    "firstVoltage",
    "secondVoltage",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dissipatedEnergy: { type: "number" },
    finalVoltage: { type: "number" },
  },
  required: ["dissipatedEnergy", "finalVoltage"],
} as const;
/** Return ideal charge-sharing energy loss and final voltage for like-polarity parallel connection; parasitic dynamics are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCapacitance, secondCapacitance, firstVoltage, secondVoltage } =
    request;
  const compute = (): Output => {
    H.positive(firstCapacitance);
    H.positive(secondCapacitance);
    const sum = firstCapacitance + secondCapacitance;
    return {
      dissipatedEnergy:
        ((0.5 * firstCapacitance * secondCapacitance) / sum) *
        (firstVoltage - secondVoltage) ** 2,
      finalVoltage:
        (firstCapacitance * firstVoltage + secondCapacitance * secondVoltage) /
        sum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCapacitance: 2,
    secondCapacitance: 2,
    firstVoltage: 6,
    secondVoltage: 2,
  },
  output: { dissipatedEnergy: 8, finalVoltage: 4 },
} satisfies ToolExample<Input, Output>;
export const capacitorChargeSharingDissipationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/capacitor-charge-sharing-dissipation",
    title: "Capacitor Charge Sharing Dissipation Tool",
    description:
      "Return ideal charge-sharing energy loss and final voltage for like-polarity parallel connection; parasitic dynamics are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCapacitance: { type: "number", exclusiveMinimum: 0 },
        secondCapacitance: { type: "number", exclusiveMinimum: 0 },
        firstVoltage: { type: "number" },
        secondVoltage: { type: "number" },
      },
      required: [
        "firstCapacitance",
        "secondCapacitance",
        "firstVoltage",
        "secondVoltage",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dissipatedEnergy: { type: "number" },
        finalVoltage: { type: "number" },
      },
      required: ["dissipatedEnergy", "finalVoltage"],
    },
    ports: {
      inputs: [
        {
          id: "firstCapacitance",
          label: "First Capacitance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCapacitance",
          label: "Second Capacitance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstVoltage",
          label: "First Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondVoltage",
          label: "Second Voltage",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dissipatedEnergy",
          label: "Dissipated Energy",
          valueType: { type: "number" },
        },
        {
          id: "finalVoltage",
          label: "Final Voltage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = capacitorChargeSharingDissipationTool.execute;
export default capacitorChargeSharingDissipationTool;
