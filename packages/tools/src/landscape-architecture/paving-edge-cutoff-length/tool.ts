import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullPaverLength: number;
  readonly suppliedCutoffLength: number;
};
export type Output = { readonly remainingLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullPaverLength: { type: "number", minimum: 0 },
    suppliedCutoffLength: { type: "number", minimum: 0 },
  },
  required: ["fullPaverLength", "suppliedCutoffLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingLength: { type: "number" } },
  required: ["remainingLength"],
} as const;
/** Subtract an explicit paving cutoff from nominal length, preserving an excessive cut as a negative remainder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullPaverLength, suppliedCutoffLength } = request;
  const compute = (): Output => {
    H.domain(
      fullPaverLength >= 0 && suppliedCutoffLength >= 0,
      "fullPaverLength",
    );
    return { remainingLength: fullPaverLength - suppliedCutoffLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fullPaverLength: 200, suppliedCutoffLength: 35 },
  output: { remainingLength: 165 },
} satisfies ToolExample<Input, Output>;
export const pavingEdgeCutoffLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "landscape-architecture",
        "landscape architecture",
        "arts and design",
      ],
      keywords: ["landscape architecture", "arts and design"],
    },
    id: "landscape-architecture/paving-edge-cutoff-length",
    title: "Paving Edge Cutoff Length",
    description:
      "Subtract an explicit paving cutoff from nominal length, preserving an excessive cut as a negative remainder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullPaverLength: { type: "number", minimum: 0 },
        suppliedCutoffLength: { type: "number", minimum: 0 },
      },
      required: ["fullPaverLength", "suppliedCutoffLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingLength: { type: "number" } },
      required: ["remainingLength"],
    },
    ports: {
      inputs: [
        {
          id: "fullPaverLength",
          label: "Full Paver Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCutoffLength",
          label: "Supplied Cutoff Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingLength",
          label: "Remaining Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pavingEdgeCutoffLengthTool.execute;
export default pavingEdgeCutoffLengthTool;
