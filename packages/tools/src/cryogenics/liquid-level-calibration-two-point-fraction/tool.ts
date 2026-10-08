import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly emptySignal: number;
  readonly fullSignal: number;
};
export type Output = { readonly levelFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    emptySignal: { type: "number" },
    fullSignal: { type: "number" },
  },
  required: ["signal", "emptySignal", "fullSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { levelFraction: { type: "number" } },
  required: ["levelFraction"],
} as const;
/** Apply a supplied two-point linear liquid-level signal calibration without clipping extrapolated fractions or converting to volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, emptySignal, fullSignal } = request;
  const compute = (): Output => {
    H.domain(fullSignal !== emptySignal, "fullSignal");
    return {
      levelFraction: (signal - emptySignal) / (fullSignal - emptySignal),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 4, emptySignal: 2, fullSignal: 10 },
  output: { levelFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const liquidLevelCalibrationTwoPointFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["cryogenics", "physics"],
        keywords: ["cryogenics", "physics"],
      },
      id: "cryogenics/liquid-level-calibration-two-point-fraction",
      title: "Liquid Level Calibration Two Point Fraction",
      description:
        "Apply a supplied two-point linear liquid-level signal calibration without clipping extrapolated fractions or converting to volume.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signal: { type: "number" },
          emptySignal: { type: "number" },
          fullSignal: { type: "number" },
        },
        required: ["signal", "emptySignal", "fullSignal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { levelFraction: { type: "number" } },
        required: ["levelFraction"],
      },
      ports: {
        inputs: [
          {
            id: "signal",
            label: "Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "emptySignal",
            label: "Empty Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fullSignal",
            label: "Full Signal",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "levelFraction",
            label: "Level Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = liquidLevelCalibrationTwoPointFractionTool.execute;
export default liquidLevelCalibrationTwoPointFractionTool;
