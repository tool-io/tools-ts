import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tonnes: number;
  readonly days: number;
  readonly chargePerTonneDay: number;
};
export type Output = { readonly charge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tonnes: { type: "number", minimum: 0 },
    days: { type: "number", minimum: 0 },
    chargePerTonneDay: { type: "number", minimum: 0 },
  },
  required: ["tonnes", "days", "chargePerTonneDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { charge: { type: "number" } },
  required: ["charge"],
} as const;
/** Calculate storage charge tonne day factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tonnes, days, chargePerTonneDay } = request;
  const compute = (): Output => {
    H.domain(tonnes >= 0 && days >= 0 && chargePerTonneDay >= 0);
    return { charge: tonnes * days * chargePerTonneDay };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tonnes: 12, days: 5, chargePerTonneDay: 2 },
  output: { charge: 120 },
} satisfies ToolExample<Input, Output>;
export const storageChargeTonneDayFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/storage-charge-tonne-day-factor",
    title: "Storage Charge Tonne Day Factor Tool",
    description:
      "Calculate storage charge tonne day factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tonnes: { type: "number", minimum: 0 },
        days: { type: "number", minimum: 0 },
        chargePerTonneDay: { type: "number", minimum: 0 },
      },
      required: ["tonnes", "days", "chargePerTonneDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { charge: { type: "number" } },
      required: ["charge"],
    },
    ports: {
      inputs: [
        {
          id: "tonnes",
          label: "Tonnes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chargePerTonneDay",
          label: "Charge Per Tonne Day",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = storageChargeTonneDayFactorTool.execute;
export default storageChargeTonneDayFactorTool;
