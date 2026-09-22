import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onlineYear: number;
  readonly issueYear: number;
  readonly preferOnline: boolean;
};
export type Output = {
  readonly selectedYear: number;
  readonly lagYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onlineYear: { type: "integer" },
    issueYear: { type: "integer" },
    preferOnline: { type: "boolean" },
  },
  required: ["onlineYear", "issueYear", "preferOnline"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedYear: { type: "integer" },
    lagYears: { type: "integer" },
  },
  required: ["selectedYear", "lagYears"],
} as const;
/** Choose between explicitly supplied early-online and issue years without selecting an indicator methodology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onlineYear, issueYear, preferOnline } = request;
  const compute = (): Output => {
    return {
      selectedYear: preferOnline ? onlineYear : issueYear,
      lagYears: issueYear - onlineYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onlineYear: 2024, issueYear: 2025, preferOnline: true },
  output: { selectedYear: 2024, lagYears: 1 },
} satisfies ToolExample<Input, Output>;
export const publicationYearEarlyOnlinePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/publication-year-early-online-pair",
    title: "Publication Year Early Online Pair Tool",
    description:
      "Choose between explicitly supplied early-online and issue years without selecting an indicator methodology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onlineYear: { type: "integer" },
        issueYear: { type: "integer" },
        preferOnline: { type: "boolean" },
      },
      required: ["onlineYear", "issueYear", "preferOnline"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedYear: { type: "integer" },
        lagYears: { type: "integer" },
      },
      required: ["selectedYear", "lagYears"],
    },
    ports: {
      inputs: [
        {
          id: "onlineYear",
          label: "Online Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "issueYear",
          label: "Issue Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "preferOnline",
          label: "Prefer Online",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "selectedYear",
          label: "Selected Year",
          valueType: { type: "integer" },
        },
        { id: "lagYears", label: "Lag Years", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicationYearEarlyOnlinePairTool.execute;
export default publicationYearEarlyOnlinePairTool;
