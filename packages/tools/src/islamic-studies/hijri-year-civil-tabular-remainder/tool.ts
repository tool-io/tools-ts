import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly year: number };
export type Output = {
  readonly cycleYear: number;
  readonly leap: boolean;
  readonly daysInYear: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { year: { type: "integer", minimum: 1 } },
  required: ["year"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleYear: { type: "integer" },
    leap: { type: "boolean" },
    daysInYear: { type: "integer" },
  },
  required: ["cycleYear", "leap", "daysInYear"],
} as const;
/** Arithmetic Islamic 30-year leap convention (11*y+14) mod 30 < 11; this is not an observed lunar calendar or a religious-date determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { year } = request;
  const compute = (): Output => {
    H.integer(year, 1);
    const y = BigInt(year),
      cycleYear = Number((y - 1n) % 30n) + 1,
      leap = (11n * y + 14n) % 30n < 11n;
    return { cycleYear, leap, daysInYear: leap ? 355 : 354 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { year: 1445 },
  output: { cycleYear: 5, leap: true, daysInYear: 355 },
} satisfies ToolExample<Input, Output>;
export const hijriYearCivilTabularRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/hijri-year-civil-tabular-remainder",
    title: "Hijri Year Civil Tabular Remainder Tool",
    description:
      "Arithmetic Islamic 30-year leap convention (11*y+14) mod 30 < 11; this is not an observed lunar calendar or a religious-date determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { year: { type: "integer", minimum: 1 } },
      required: ["year"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleYear: { type: "integer" },
        leap: { type: "boolean" },
        daysInYear: { type: "integer" },
      },
      required: ["cycleYear", "leap", "daysInYear"],
    },
    ports: {
      inputs: [
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "cycleYear",
          label: "Cycle Year",
          valueType: { type: "integer" },
        },
        { id: "leap", label: "Leap", valueType: { type: "boolean" } },
        {
          id: "daysInYear",
          label: "Days In Year",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = hijriYearCivilTabularRemainderTool.execute;
export default hijriYearCivilTabularRemainderTool;
