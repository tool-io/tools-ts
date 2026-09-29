import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly firstYear: number;
  readonly secondYear: number;
  readonly consecutive: boolean;
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
    firstYear: { type: "integer" },
    secondYear: { type: "integer" },
    consecutive: { type: "boolean" },
  },
  required: ["firstYear", "secondYear", "consecutive"],
} as const;
/** Expand a supplied four-digit/slash/two-or-four-digit double-year token without converting a historical calendar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^([1-9]\d{3})\/(\d{2}|\d{4})(?![\s\S])/.exec(token);
    H.domain(match, "token");
    const firstYear = Number(match[1]),
      raw = Number(match[2]),
      secondYear =
        match[2].length === 4
          ? raw
          : Math.floor(firstYear / 100) * 100 +
            raw +
            (raw < firstYear % 100 ? 100 : 0);
    return { firstYear, secondYear, consecutive: secondYear === firstYear + 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "1699/00" },
  output: { firstYear: 1699, secondYear: 1700, consecutive: true },
} satisfies ToolExample<Input, Output>;
export const historicalDateDoubleYearTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/historical-date-double-year-token",
    title: "Historical Date Double Year Token Tool",
    description:
      "Expand a supplied four-digit/slash/two-or-four-digit double-year token without converting a historical calendar.",
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
        firstYear: { type: "integer" },
        secondYear: { type: "integer" },
        consecutive: { type: "boolean" },
      },
      required: ["firstYear", "secondYear", "consecutive"],
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
        {
          id: "firstYear",
          label: "First Year",
          valueType: { type: "integer" },
        },
        {
          id: "secondYear",
          label: "Second Year",
          valueType: { type: "integer" },
        },
        {
          id: "consecutive",
          label: "Consecutive",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalDateDoubleYearTokenTool.execute;
export default historicalDateDoubleYearTokenTool;
