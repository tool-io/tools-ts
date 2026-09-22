import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalVolume: number;
  readonly aliquotVolume: number;
};
export type Output = { readonly fraction: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number", minimum: 0 },
    aliquotVolume: { type: "number", minimum: 0 },
  },
  required: ["totalVolume", "aliquotVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, defined: { type: "boolean" } },
  required: ["fraction", "defined"],
} as const;
/** Preserve the undefined zero-volume aliquot fraction with an explicit flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalVolume, aliquotVolume } = request;
  const compute = (): Output => {
    H.domain(
      totalVolume >= 0 && aliquotVolume >= 0 && aliquotVolume <= totalVolume,
    );
    return {
      fraction: totalVolume > 0 ? aliquotVolume / totalVolume : 0,
      defined: totalVolume > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalVolume: 0, aliquotVolume: 0 },
  output: { fraction: 0, defined: false },
} satisfies ToolExample<Input, Output>;
export const specimenAliquotZeroBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/specimen-aliquot-zero-base-flag",
    title: "Specimen Aliquot Zero Base Flag Tool",
    description:
      "Preserve the undefined zero-volume aliquot fraction with an explicit flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalVolume: { type: "number", minimum: 0 },
        aliquotVolume: { type: "number", minimum: 0 },
      },
      required: ["totalVolume", "aliquotVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["fraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "totalVolume",
          label: "Total Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aliquotVolume",
          label: "Aliquot Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = specimenAliquotZeroBaseFlagTool.execute;
export default specimenAliquotZeroBaseFlagTool;
