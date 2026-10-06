import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossReading: number;
  readonly tareReading: number;
};
export type Output = { readonly netReading: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossReading: { type: "number" },
    tareReading: { type: "number" },
  },
  required: ["grossReading", "tareReading"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netReading: { type: "number" } },
  required: ["netReading"],
} as const;
/** Subtract an explicit tare reading from a livestock scale reading while preserving a negative result for data review. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossReading, tareReading } = request;
  const compute = (): Output => {
    return { netReading: grossReading - tareReading };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossReading: 540, tareReading: 40 },
  output: { netReading: 500 },
} satisfies ToolExample<Input, Output>;
export const livestockScaleTareReadingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/livestock-scale-tare-reading",
    title: "Livestock Scale Tare Reading",
    description:
      "Subtract an explicit tare reading from a livestock scale reading while preserving a negative result for data review.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossReading: { type: "number" },
        tareReading: { type: "number" },
      },
      required: ["grossReading", "tareReading"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netReading: { type: "number" } },
      required: ["netReading"],
    },
    ports: {
      inputs: [
        {
          id: "grossReading",
          label: "Gross Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tareReading",
          label: "Tare Reading",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netReading",
          label: "Net Reading",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = livestockScaleTareReadingTool.execute;
export default livestockScaleTareReadingTool;
