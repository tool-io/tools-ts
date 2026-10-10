import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousOdometer: number;
  readonly currentOdometer: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousOdometer: { type: "number" },
    currentOdometer: { type: "number" },
  },
  required: ["previousOdometer", "currentOdometer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit noncombat vehicle odometer readings on compatible units, preserving resets as negative discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousOdometer, currentOdometer } = request;
  const compute = (): Output => {
    return { signedGap: currentOdometer - previousOdometer };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousOdometer: 12, currentOdometer: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const noncombatMotorPoolMileageDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["military-science", "military science", "social sciences"],
      keywords: ["military science", "social sciences"],
    },
    id: "military-science/noncombat-motor-pool-mileage-delta",
    title: "Noncombat Motor Pool Mileage Delta",
    description:
      "Subtract explicit noncombat vehicle odometer readings on compatible units, preserving resets as negative discrepancies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousOdometer: { type: "number" },
        currentOdometer: { type: "number" },
      },
      required: ["previousOdometer", "currentOdometer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "previousOdometer",
          label: "Previous Odometer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentOdometer",
          label: "Current Odometer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = noncombatMotorPoolMileageDeltaTool.execute;
export default noncombatMotorPoolMileageDeltaTool;
