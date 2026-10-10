import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly backgroundWellSignal: number;
  readonly sampleWellSignal: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    backgroundWellSignal: { type: "number" },
    sampleWellSignal: { type: "number" },
  },
  required: ["backgroundWellSignal", "sampleWellSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit immune-assay background-well signal from sample-well signal in matching units without clipping negative residuals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { backgroundWellSignal, sampleWellSignal } = request;
  const compute = (): Output => {
    return { signedGap: sampleWellSignal - backgroundWellSignal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { backgroundWellSignal: 12, sampleWellSignal: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const immuneAssayBackgroundWellSubtractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/immune-assay-background-well-subtraction",
      title: "Immune Assay Background Well Subtraction Tool",
      description:
        "Subtract explicit immune-assay background-well signal from sample-well signal in matching units without clipping negative residuals.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          backgroundWellSignal: { type: "number" },
          sampleWellSignal: { type: "number" },
        },
        required: ["backgroundWellSignal", "sampleWellSignal"],
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
            id: "backgroundWellSignal",
            label: "Background Well Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleWellSignal",
            label: "Sample Well Signal",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = immuneAssayBackgroundWellSubtractionTool.execute;
export default immuneAssayBackgroundWellSubtractionTool;
