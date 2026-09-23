import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly voidVolume: number; readonly bedVolume: number };
export type Output = { readonly voidFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidVolume: { type: "number", minimum: 0 },
    bedVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["voidVolume", "bedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { voidFraction: { type: "number" } },
  required: ["voidFraction"],
} as const;
/** Calculate chromatography bed void fraction term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voidVolume, bedVolume } = request;
  const compute = (): Output => {
    H.positive(bedVolume);
    H.domain(voidVolume >= 0 && voidVolume <= bedVolume);
    return { voidFraction: voidVolume / bedVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voidVolume: 40, bedVolume: 100 },
  output: { voidFraction: 0.4 },
} satisfies ToolExample<Input, Output>;
export const chromatographyBedVoidFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/chromatography-bed-void-fraction-term",
    title: "Chromatography BED Void Fraction Term Tool",
    description:
      "Calculate chromatography bed void fraction term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voidVolume: { type: "number", minimum: 0 },
        bedVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["voidVolume", "bedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { voidFraction: { type: "number" } },
      required: ["voidFraction"],
    },
    ports: {
      inputs: [
        {
          id: "voidVolume",
          label: "Void Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bedVolume",
          label: "Bed Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voidFraction",
          label: "Void Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chromatographyBedVoidFractionTermTool.execute;
export default chromatographyBedVoidFractionTermTool;
