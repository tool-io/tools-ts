import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingLiters: number;
  readonly receivedLiters: number;
  readonly consumedLiters: number;
};
export type Output = { readonly closingLiters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingLiters: { type: "number", minimum: 0 },
    receivedLiters: { type: "number", minimum: 0 },
    consumedLiters: { type: "number", minimum: 0 },
  },
  required: ["openingLiters", "receivedLiters", "consumedLiters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingLiters: { type: "number" } },
  required: ["closingLiters"],
} as const;
/** Balance a non-combat administrative fuel log from recorded opening, received and consumed quantities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingLiters, receivedLiters, consumedLiters } = request;
  const compute = (): Output => {
    H.domain(
      openingLiters >= 0 &&
        receivedLiters >= 0 &&
        consumedLiters >= 0 &&
        consumedLiters <= openingLiters + receivedLiters,
      "openingLiters",
    );
    return { closingLiters: openingLiters + receivedLiters - consumedLiters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingLiters: 100, receivedLiters: 40, consumedLiters: 25 },
  output: { closingLiters: 115 },
} satisfies ToolExample<Input, Output>;
export const nonCombatFuelLogEntryBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/non-combat-fuel-log-entry-balance",
    title: "Non Combat Fuel Log Entry Balance Tool",
    description:
      "Balance a non-combat administrative fuel log from recorded opening, received and consumed quantities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingLiters: { type: "number", minimum: 0 },
        receivedLiters: { type: "number", minimum: 0 },
        consumedLiters: { type: "number", minimum: 0 },
      },
      required: ["openingLiters", "receivedLiters", "consumedLiters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingLiters: { type: "number" } },
      required: ["closingLiters"],
    },
    ports: {
      inputs: [
        {
          id: "openingLiters",
          label: "Opening Liters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivedLiters",
          label: "Received Liters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "consumedLiters",
          label: "Consumed Liters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingLiters",
          label: "Closing Liters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nonCombatFuelLogEntryBalanceTool.execute;
export default nonCombatFuelLogEntryBalanceTool;
