import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedSignal: number;
  readonly zeroSignal: number;
  readonly suppliedGain: number;
};
export type Output = { readonly correctedSignal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedSignal: { type: "number" },
    zeroSignal: { type: "number" },
    suppliedGain: { type: "number" },
  },
  required: ["recordedSignal", "zeroSignal", "suppliedGain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedSignal: { type: "number" } },
  required: ["correctedSignal"],
} as const;
/** Remove an explicit instrument zero and signed gain without determining calibration coefficients. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedSignal, zeroSignal, suppliedGain } = request;
  const compute = (): Output => {
    H.domain(suppliedGain !== 0, "suppliedGain");
    return { correctedSignal: (recordedSignal - zeroSignal) / suppliedGain };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedSignal: 25, zeroSignal: 5, suppliedGain: 4 },
  output: { correctedSignal: 5 },
} satisfies ToolExample<Input, Output>;
export const geophysicalInstrumentGainCorrectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["geophysics", "physics"],
        keywords: ["geophysics", "physics"],
      },
      id: "geophysics/geophysical-instrument-gain-correction",
      title: "Geophysical Instrument Gain Correction",
      description:
        "Remove an explicit instrument zero and signed gain without determining calibration coefficients.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedSignal: { type: "number" },
          zeroSignal: { type: "number" },
          suppliedGain: { type: "number" },
        },
        required: ["recordedSignal", "zeroSignal", "suppliedGain"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { correctedSignal: { type: "number" } },
        required: ["correctedSignal"],
      },
      ports: {
        inputs: [
          {
            id: "recordedSignal",
            label: "Recorded Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "zeroSignal",
            label: "Zero Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedGain",
            label: "Supplied Gain",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedSignal",
            label: "Corrected Signal",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geophysicalInstrumentGainCorrectionTool.execute;
export default geophysicalInstrumentGainCorrectionTool;
