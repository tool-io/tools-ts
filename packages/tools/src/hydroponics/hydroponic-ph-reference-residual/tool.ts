import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedReferencePh: number;
  readonly recordedPh: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedReferencePh: { type: "number" },
    recordedPh: { type: "number" },
  },
  required: ["suppliedReferencePh", "recordedPh"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit reference pH from recorded pH without treating the difference as concentration or recommending correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedReferencePh, recordedPh } = request;
  const compute = (): Output => {
    return { signedGap: recordedPh - suppliedReferencePh };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedReferencePh: 12, recordedPh: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const hydroponicPhReferenceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["hydroponics", "agriculture"],
      keywords: ["hydroponics", "agriculture"],
    },
    id: "hydroponics/hydroponic-ph-reference-residual",
    title: "Hydroponic pH Reference Residual",
    description:
      "Subtract an explicit reference pH from recorded pH without treating the difference as concentration or recommending correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedReferencePh: { type: "number" },
        recordedPh: { type: "number" },
      },
      required: ["suppliedReferencePh", "recordedPh"],
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
          id: "suppliedReferencePh",
          label: "Supplied Reference Ph",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedPh",
          label: "Recorded Ph",
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
export const run = hydroponicPhReferenceResidualTool.execute;
export default hydroponicPhReferenceResidualTool;
