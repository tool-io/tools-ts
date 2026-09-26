import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referencePeakCurrent: number;
  readonly referenceScanRate: number;
  readonly scanRate: number;
};
export type Output = { readonly ratio: number; readonly peakCurrent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referencePeakCurrent: { type: "number" },
    referenceScanRate: { type: "number", exclusiveMinimum: 0 },
    scanRate: { type: "number", minimum: 0 },
  },
  required: ["referencePeakCurrent", "referenceScanRate", "scanRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, peakCurrent: { type: "number" } },
  required: ["ratio", "peakCurrent"],
} as const;
/** Diffusion-controlled reversible peak-current square-root scan-rate scaling with all other conditions held fixed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referencePeakCurrent, referenceScanRate, scanRate } = request;
  const compute = (): Output => {
    H.positive(referenceScanRate);
    H.domain(scanRate >= 0);
    return {
      ratio: Math.sqrt(scanRate / referenceScanRate),
      peakCurrent:
        referencePeakCurrent * Math.sqrt(scanRate / referenceScanRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referencePeakCurrent: 4, referenceScanRate: 0.1, scanRate: 0.4 },
  output: { ratio: 2, peakCurrent: 8 },
} satisfies ToolExample<Input, Output>;
export const randlesSevcikScanRateSquareRootFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/randles-sevcik-scan-rate-square-root-factor",
      title: "Randles Sevcik Scan Rate Square Root Factor Tool",
      description:
        "Diffusion-controlled reversible peak-current square-root scan-rate scaling with all other conditions held fixed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referencePeakCurrent: { type: "number" },
          referenceScanRate: { type: "number", exclusiveMinimum: 0 },
          scanRate: { type: "number", minimum: 0 },
        },
        required: ["referencePeakCurrent", "referenceScanRate", "scanRate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ratio: { type: "number" },
          peakCurrent: { type: "number" },
        },
        required: ["ratio", "peakCurrent"],
      },
      ports: {
        inputs: [
          {
            id: "referencePeakCurrent",
            label: "Reference Peak Current",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceScanRate",
            label: "Reference Scan Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scanRate",
            label: "Scan Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
          {
            id: "peakCurrent",
            label: "Peak Current",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = randlesSevcikScanRateSquareRootFactorTool.execute;
export default randlesSevcikScanRateSquareRootFactorTool;
