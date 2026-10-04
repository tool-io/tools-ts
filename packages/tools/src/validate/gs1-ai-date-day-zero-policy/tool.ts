import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly allowDayZero: boolean;
  readonly century: number;
};
export type Output = {
  readonly valid: boolean;
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly lastDayOfMonth: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    allowDayZero: { type: "boolean" },
    century: { type: "integer", minimum: 0, maximum: 99 },
  },
  required: ["token", "allowDayZero", "century"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    year: { type: "integer" },
    month: { type: "integer" },
    day: { type: "integer" },
    lastDayOfMonth: { type: "boolean" },
  },
  required: ["valid", "year", "month", "day", "lastDayOfMonth"],
} as const;
/** Calculate gs1 ai date day zero policy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, allowDayZero, century } = request;
  const compute = (): Output => {
    H.integer(century, 0, 99);
    const r = /^(\d{2})(\d{2})(\d{2})(?![\s\S])/.exec(token);
    if (!r)
      return { valid: false, year: 0, month: 0, day: 0, lastDayOfMonth: false };
    const year = century * 100 + Number(r[1]),
      month = Number(r[2]),
      day = Number(r[3]),
      lastDayOfMonth = day === 0;
    if (month < 1 || month > 12 || (lastDayOfMonth && !allowDayZero))
      return { valid: false, year, month, day, lastDayOfMonth };
    const d = new Date(0);
    d.setUTCFullYear(year, month, 0);
    const maximum = d.getUTCDate();
    return {
      valid: day === 0 || day <= maximum,
      year,
      month,
      day: lastDayOfMonth ? maximum : day,
      lastDayOfMonth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "260200", allowDayZero: true, century: 20 },
  output: { valid: true, year: 2026, month: 2, day: 28, lastDayOfMonth: true },
} satisfies ToolExample<Input, Output>;
export const gs1AiDateDayZeroPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/gs1-ai-date-day-zero-policy",
    title: "GS1 AI Date Day Zero Policy Tool",
    description:
      "Calculate gs1 ai date day zero policy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        allowDayZero: { type: "boolean" },
        century: { type: "integer", minimum: 0, maximum: 99 },
      },
      required: ["token", "allowDayZero", "century"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        year: { type: "integer" },
        month: { type: "integer" },
        day: { type: "integer" },
        lastDayOfMonth: { type: "boolean" },
      },
      required: ["valid", "year", "month", "day", "lastDayOfMonth"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowDayZero",
          label: "Allow Day Zero",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "century",
          label: "Century",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        { id: "year", label: "Year", valueType: { type: "integer" } },
        { id: "month", label: "Month", valueType: { type: "integer" } },
        { id: "day", label: "Day", valueType: { type: "integer" } },
        {
          id: "lastDayOfMonth",
          label: "Last Day Of Month",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gs1AiDateDayZeroPolicyTool.execute;
export default gs1AiDateDayZeroPolicyTool;
