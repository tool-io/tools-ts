import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cycles: number; readonly writesPerDay: number };
export type Output = { readonly days: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycles: { type: "integer", minimum: 0 },
    writesPerDay: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cycles", "writesPerDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { days: { type: "number" } },
  required: ["days"],
} as const;
/** Divide a supplied per-cell write endurance by a constant write rate; wear leveling and retention are excluded. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { cycles, writesPerDay } = input;
  const compute = (): Output => {
    H.integer(cycles, 0);
    H.positive(writesPerDay);
    return { days: cycles / writesPerDay };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { cycles: 100000, writesPerDay: 100 },
  output: { days: 1000 },
} satisfies ToolExample<Input, Output>;
export const eepromEnduranceWriteRateLifeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/eeprom-endurance-write-rate-life-term",
    title: "Eeprom Endurance Write Rate Life Term Tool",
    description:
      "Divide a supplied per-cell write endurance by a constant write rate; wear leveling and retention are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycles: { type: "integer", minimum: 0 },
        writesPerDay: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["cycles", "writesPerDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { days: { type: "number" } },
      required: ["days"],
    },
    ports: {
      inputs: [
        {
          id: "cycles",
          label: "Cycles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "writesPerDay",
          label: "Writes Per Day",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "days", label: "Days", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = eepromEnduranceWriteRateLifeTermTool.execute;
export default eepromEnduranceWriteRateLifeTermTool;
