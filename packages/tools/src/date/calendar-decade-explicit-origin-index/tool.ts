import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly year: number; readonly origin: number };
export type Output = { readonly index: number; readonly firstYear: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { year: { type: "integer" }, origin: { type: "integer" } },
  required: ["year", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "integer" }, firstYear: { type: "integer" } },
  required: ["index", "firstYear"],
} as const;
/** Calculate calendar decade explicit origin index from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { year, origin } = input;
  const compute = (): Output => {
    const index = Math.floor((year - origin) / 10);
    return { index, firstYear: origin + 10 * index };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { year: 2026, origin: 2000 },
  output: { index: 2, firstYear: 2020 },
} satisfies ToolExample<Input, Output>;
export const calendarDecadeExplicitOriginIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/calendar-decade-explicit-origin-index",
    title: "Calendar Decade Explicit Origin Index Tool",
    description:
      "Calculate calendar decade explicit origin index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { year: { type: "integer" }, origin: { type: "integer" } },
      required: ["year", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        firstYear: { type: "integer" },
      },
      required: ["index", "firstYear"],
    },
    ports: {
      inputs: [
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
        {
          id: "firstYear",
          label: "First Year",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = calendarDecadeExplicitOriginIndexTool.execute;
export default calendarDecadeExplicitOriginIndexTool;
