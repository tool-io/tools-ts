import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly weeks: number;
  readonly days: number;
  readonly totalDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weeks: { type: "integer" },
    days: { type: "integer" },
    totalDays: { type: "integer" },
  },
  required: ["weeks", "days", "totalDays"],
} as const;
/** Parse a supplied weeks-plus-days research token. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^(0|[1-9]\d*)\+([0-6])(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const weeks = Number(match[1]),
      days = Number(match[2]);
    H.integer(weeks, 0);
    return { weeks, days, totalDays: weeks * 7 + days };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "12+3" },
  output: { weeks: 12, days: 3, totalDays: 87 },
} satisfies ToolExample<Input, Output>;
export const obstetricResearchGestationWeekdayTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "obstetrics/obstetric-research-gestation-weekday-token",
      title: "Obstetric Research Gestation Weekday Token Tool",
      description: "Parse a supplied weeks-plus-days research token.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weeks: { type: "integer" },
          days: { type: "integer" },
          totalDays: { type: "integer" },
        },
        required: ["weeks", "days", "totalDays"],
      },
      ports: {
        inputs: [
          {
            id: "token",
            label: "Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "weeks", label: "Weeks", valueType: { type: "integer" } },
          { id: "days", label: "Days", valueType: { type: "integer" } },
          {
            id: "totalDays",
            label: "Total Days",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = obstetricResearchGestationWeekdayTokenTool.execute;
export default obstetricResearchGestationWeekdayTokenTool;
