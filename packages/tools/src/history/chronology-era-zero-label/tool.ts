import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yearLabel: number;
  readonly hasYearZero: boolean;
};
export type Output = {
  readonly validLabel: boolean;
  readonly astronomicalYear: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yearLabel: { type: "integer" },
    hasYearZero: { type: "boolean" },
  },
  required: ["yearLabel", "hasYearZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validLabel: { type: "boolean" },
    astronomicalYear: { type: "integer" },
  },
  required: ["validLabel", "astronomicalYear"],
} as const;
/** Map signed year labels under an explicit presence or absence of year zero; zero in a no-zero era is flagged invalid. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yearLabel, hasYearZero } = request;
  const compute = (): Output => {
    return {
      validLabel: hasYearZero || yearLabel !== 0,
      astronomicalYear: hasYearZero
        ? yearLabel
        : yearLabel < 0
          ? yearLabel + 1
          : yearLabel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { yearLabel: -1, hasYearZero: false },
  output: { validLabel: true, astronomicalYear: 0 },
} satisfies ToolExample<Input, Output>;
export const chronologyEraZeroLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/chronology-era-zero-label",
    title: "Chronology Era Zero Label Tool",
    description:
      "Map signed year labels under an explicit presence or absence of year zero; zero in a no-zero era is flagged invalid.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yearLabel: { type: "integer" },
        hasYearZero: { type: "boolean" },
      },
      required: ["yearLabel", "hasYearZero"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validLabel: { type: "boolean" },
        astronomicalYear: { type: "integer" },
      },
      required: ["validLabel", "astronomicalYear"],
    },
    ports: {
      inputs: [
        {
          id: "yearLabel",
          label: "Year Label",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "hasYearZero",
          label: "Has Year Zero",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "validLabel",
          label: "Valid Label",
          valueType: { type: "boolean" },
        },
        {
          id: "astronomicalYear",
          label: "Astronomical Year",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = chronologyEraZeroLabelTool.execute;
export default chronologyEraZeroLabelTool;
