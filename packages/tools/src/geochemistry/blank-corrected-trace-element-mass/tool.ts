import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly blankMass: number; readonly sampleMass: number };
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { blankMass: { type: "number" }, sampleMass: { type: "number" } },
  required: ["blankMass", "sampleMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit trace-element blank mass from sample mass in matching units without clipping signed analytical residuals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blankMass, sampleMass } = request;
  const compute = (): Output => {
    return { signedGap: sampleMass - blankMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { blankMass: 12, sampleMass: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const blankCorrectedTraceElementMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/blank-corrected-trace-element-mass",
    title: "Blank Corrected Trace Element Mass Tool",
    description:
      "Subtract an explicit trace-element blank mass from sample mass in matching units without clipping signed analytical residuals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blankMass: { type: "number" },
        sampleMass: { type: "number" },
      },
      required: ["blankMass", "sampleMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "blankMass",
          label: "Blank Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = blankCorrectedTraceElementMassTool.execute;
export default blankCorrectedTraceElementMassTool;
