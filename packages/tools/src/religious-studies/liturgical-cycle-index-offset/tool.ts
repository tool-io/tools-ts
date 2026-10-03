import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly index: number;
  readonly offset: number;
  readonly cycleLength: number;
  readonly origin: number;
};
export type Output = { readonly shiftedIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    offset: { type: "integer" },
    cycleLength: { type: "integer", minimum: 1 },
    origin: { type: "integer" },
  },
  required: ["index", "offset", "cycleLength", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shiftedIndex: { type: "integer" } },
  required: ["shiftedIndex"],
} as const;
/** Shift a caller-defined cycle index without inferring a religious calendar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, offset, cycleLength, origin } = request;
  const compute = (): Output => {
    H.domain(origin === 0 || origin === 1);
    H.integer(cycleLength, 1);
    H.integer(index, origin, origin + cycleLength - 1);
    const n = BigInt(cycleLength),
      x = BigInt(index) - BigInt(origin) + BigInt(offset);
    return { shiftedIndex: Number(((x % n) + n) % n) + origin };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 3, offset: 2, cycleLength: 4, origin: 1 },
  output: { shiftedIndex: 1 },
} satisfies ToolExample<Input, Output>;
export const liturgicalCycleIndexOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/liturgical-cycle-index-offset",
    title: "Liturgical Cycle Index Offset Tool",
    description:
      "Shift a caller-defined cycle index without inferring a religious calendar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        offset: { type: "integer" },
        cycleLength: { type: "integer", minimum: 1 },
        origin: { type: "integer" },
      },
      required: ["index", "offset", "cycleLength", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shiftedIndex: { type: "integer" } },
      required: ["shiftedIndex"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cycleLength",
          label: "Cycle Length",
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
        {
          id: "shiftedIndex",
          label: "Shifted Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = liturgicalCycleIndexOffsetTool.execute;
export default liturgicalCycleIndexOffsetTool;
