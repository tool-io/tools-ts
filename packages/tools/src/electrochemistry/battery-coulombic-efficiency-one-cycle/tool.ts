import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly chargeAh: number; readonly dischargeAh: number };
export type Output = {
  readonly efficiency: number;
  readonly unrecoveredAh: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chargeAh: { type: "number", exclusiveMinimum: 0 },
    dischargeAh: { type: "number", minimum: 0 },
  },
  required: ["chargeAh", "dischargeAh"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    efficiency: { type: "number" },
    unrecoveredAh: { type: "number" },
  },
  required: ["efficiency", "unrecoveredAh"],
} as const;
/** Discharge/charge coulombic efficiency; values over one remain visible rather than being clipped. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chargeAh, dischargeAh } = request;
  const compute = (): Output => {
    H.positive(chargeAh);
    H.domain(dischargeAh >= 0);
    return {
      efficiency: dischargeAh / chargeAh,
      unrecoveredAh: chargeAh - dischargeAh,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chargeAh: 100, dischargeAh: 95 },
  output: { efficiency: 0.95, unrecoveredAh: 5 },
} satisfies ToolExample<Input, Output>;
export const batteryCoulombicEfficiencyOneCycleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/battery-coulombic-efficiency-one-cycle",
    title: "Battery Coulombic Efficiency One Cycle Tool",
    description:
      "Discharge/charge coulombic efficiency; values over one remain visible rather than being clipped.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chargeAh: { type: "number", exclusiveMinimum: 0 },
        dischargeAh: { type: "number", minimum: 0 },
      },
      required: ["chargeAh", "dischargeAh"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        efficiency: { type: "number" },
        unrecoveredAh: { type: "number" },
      },
      required: ["efficiency", "unrecoveredAh"],
    },
    ports: {
      inputs: [
        {
          id: "chargeAh",
          label: "Charge Ah",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dischargeAh",
          label: "Discharge Ah",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "efficiency",
          label: "Efficiency",
          valueType: { type: "number" },
        },
        {
          id: "unrecoveredAh",
          label: "Unrecovered Ah",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = batteryCoulombicEfficiencyOneCycleTool.execute;
export default batteryCoulombicEfficiencyOneCycleTool;
