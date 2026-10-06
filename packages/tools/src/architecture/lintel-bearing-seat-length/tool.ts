import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lintelLength: number;
  readonly clearOpeningWidth: number;
};
export type Output = { readonly equalSeatLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lintelLength: { type: "number", minimum: 0 },
    clearOpeningWidth: { type: "number", minimum: 0 },
  },
  required: ["lintelLength", "clearOpeningWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equalSeatLength: { type: "number" } },
  required: ["equalSeatLength"],
} as const;
/** Calculate equal end-seat lengths from explicit centered lintel and opening widths, preserving a shortfall without structural assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lintelLength, clearOpeningWidth } = request;
  const compute = (): Output => {
    H.domain(lintelLength >= 0 && clearOpeningWidth >= 0, "lintelLength");
    return { equalSeatLength: (lintelLength - clearOpeningWidth) / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lintelLength: 1200, clearOpeningWidth: 1000 },
  output: { equalSeatLength: 100 },
} satisfies ToolExample<Input, Output>;
export const lintelBearingSeatLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["architecture", "arts and design"],
      keywords: ["architecture", "arts and design"],
    },
    id: "architecture/lintel-bearing-seat-length",
    title: "Lintel Bearing Seat Length",
    description:
      "Calculate equal end-seat lengths from explicit centered lintel and opening widths, preserving a shortfall without structural assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lintelLength: { type: "number", minimum: 0 },
        clearOpeningWidth: { type: "number", minimum: 0 },
      },
      required: ["lintelLength", "clearOpeningWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equalSeatLength: { type: "number" } },
      required: ["equalSeatLength"],
    },
    ports: {
      inputs: [
        {
          id: "lintelLength",
          label: "Lintel Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clearOpeningWidth",
          label: "Clear Opening Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equalSeatLength",
          label: "Equal Seat Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lintelBearingSeatLengthTool.execute;
export default lintelBearingSeatLengthTool;
