import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly backgroundSignal: number;
  readonly reporterSignal: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    backgroundSignal: { type: "number" },
    reporterSignal: { type: "number" },
  },
  required: ["backgroundSignal", "reporterSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract supplied developmental reporter background from measured signal in matching units without inferring gene expression. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { backgroundSignal, reporterSignal } = request;
  const compute = (): Output => {
    return { signedGap: reporterSignal - backgroundSignal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { backgroundSignal: 12, reporterSignal: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const developmentalReporterBackgroundSubtractionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-biology/developmental-reporter-background-subtraction-term",
      title: "Developmental Reporter Background Subtraction Term Tool",
      description:
        "Subtract supplied developmental reporter background from measured signal in matching units without inferring gene expression.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          backgroundSignal: { type: "number" },
          reporterSignal: { type: "number" },
        },
        required: ["backgroundSignal", "reporterSignal"],
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
            id: "backgroundSignal",
            label: "Background Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reporterSignal",
            label: "Reporter Signal",
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
export const run = developmentalReporterBackgroundSubtractionTermTool.execute;
export default developmentalReporterBackgroundSubtractionTermTool;
