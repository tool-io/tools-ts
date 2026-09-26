import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialSoc: number;
  readonly signedCurrentA: number;
  readonly durationHours: number;
  readonly capacityAh: number;
  readonly efficiency: number;
};
export type Output = {
  readonly socIncrement: number;
  readonly finalSoc: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialSoc: { type: "number", minimum: 0, maximum: 1 },
    signedCurrentA: { type: "number" },
    durationHours: { type: "number", minimum: 0 },
    capacityAh: { type: "number", exclusiveMinimum: 0 },
    efficiency: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "initialSoc",
    "signedCurrentA",
    "durationHours",
    "capacityAh",
    "efficiency",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    socIncrement: { type: "number" },
    finalSoc: { type: "number" },
  },
  required: ["socIncrement", "finalSoc"],
} as const;
/** Signed coulomb-count increment, charging positive; final SOC is intentionally not clipped to hide overrun. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialSoc, signedCurrentA, durationHours, capacityAh, efficiency } =
    request;
  const compute = (): Output => {
    H.probability(initialSoc);
    H.domain(durationHours >= 0);
    H.positive(capacityAh);
    H.probability(efficiency);
    return {
      socIncrement: (signedCurrentA * durationHours * efficiency) / capacityAh,
      finalSoc:
        initialSoc + (signedCurrentA * durationHours * efficiency) / capacityAh,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialSoc: 0.4,
    signedCurrentA: 2,
    durationHours: 1,
    capacityAh: 10,
    efficiency: 1,
  },
  output: { socIncrement: 0.2, finalSoc: 0.6000000000000001 },
} satisfies ToolExample<Input, Output>;
export const batterySocChargeCountIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/battery-soc-charge-count-increment",
    title: "Battery Soc Charge Count Increment Tool",
    description:
      "Signed coulomb-count increment, charging positive; final SOC is intentionally not clipped to hide overrun.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialSoc: { type: "number", minimum: 0, maximum: 1 },
        signedCurrentA: { type: "number" },
        durationHours: { type: "number", minimum: 0 },
        capacityAh: { type: "number", exclusiveMinimum: 0 },
        efficiency: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "initialSoc",
        "signedCurrentA",
        "durationHours",
        "capacityAh",
        "efficiency",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        socIncrement: { type: "number" },
        finalSoc: { type: "number" },
      },
      required: ["socIncrement", "finalSoc"],
    },
    ports: {
      inputs: [
        {
          id: "initialSoc",
          label: "Initial Soc",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedCurrentA",
          label: "Signed Current A",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationHours",
          label: "Duration Hours",
          required: true,
          valueType: { type: "number", unit: "h" },
        },
        {
          id: "capacityAh",
          label: "Capacity Ah",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "efficiency",
          label: "Efficiency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "socIncrement",
          label: "Soc Increment",
          valueType: { type: "number" },
        },
        { id: "finalSoc", label: "Final Soc", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = batterySocChargeCountIncrementTool.execute;
export default batterySocChargeCountIncrementTool;
