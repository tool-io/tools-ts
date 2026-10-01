import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commonModeGain: number;
  readonly differentialGain: number;
  readonly commonModeAmplitude: number;
  readonly differentialAmplitude: number;
};
export type Output = {
  readonly cmrrDb: number;
  readonly residualCommonMode: number;
  readonly differentialOutput: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commonModeGain: { type: "number" },
    differentialGain: { type: "number" },
    commonModeAmplitude: { type: "number" },
    differentialAmplitude: { type: "number" },
  },
  required: [
    "commonModeGain",
    "differentialGain",
    "commonModeAmplitude",
    "differentialAmplitude",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cmrrDb: { type: "number" },
    residualCommonMode: { type: "number" },
    differentialOutput: { type: "number" },
  },
  required: ["cmrrDb", "residualCommonMode", "differentialOutput"],
} as const;
/** Supplied differential/common-mode gain rejection ratio using amplitude dB, without an EEG amplifier certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    commonModeGain,
    differentialGain,
    commonModeAmplitude,
    differentialAmplitude,
  } = request;
  const compute = (): Output => {
    H.domain(commonModeGain !== 0 && differentialGain !== 0);
    return {
      cmrrDb: 20 * Math.log10(Math.abs(differentialGain / commonModeGain)),
      residualCommonMode: commonModeGain * commonModeAmplitude,
      differentialOutput: differentialGain * differentialAmplitude,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    commonModeGain: 0.01,
    differentialGain: 100,
    commonModeAmplitude: 1,
    differentialAmplitude: 0.001,
  },
  output: { cmrrDb: 80, residualCommonMode: 0.01, differentialOutput: 0.1 },
} satisfies ToolExample<Input, Output>;
export const eegCommonmodeRejectionSignalRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-commonmode-rejection-signal-ratio",
    title: "EEG Commonmode Rejection Signal Ratio Tool",
    description:
      "Supplied differential/common-mode gain rejection ratio using amplitude dB, without an EEG amplifier certification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commonModeGain: { type: "number" },
        differentialGain: { type: "number" },
        commonModeAmplitude: { type: "number" },
        differentialAmplitude: { type: "number" },
      },
      required: [
        "commonModeGain",
        "differentialGain",
        "commonModeAmplitude",
        "differentialAmplitude",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cmrrDb: { type: "number" },
        residualCommonMode: { type: "number" },
        differentialOutput: { type: "number" },
      },
      required: ["cmrrDb", "residualCommonMode", "differentialOutput"],
    },
    ports: {
      inputs: [
        {
          id: "commonModeGain",
          label: "Common Mode Gain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "differentialGain",
          label: "Differential Gain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commonModeAmplitude",
          label: "Common Mode Amplitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "differentialAmplitude",
          label: "Differential Amplitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cmrrDb", label: "Cmrr Db", valueType: { type: "number" } },
        {
          id: "residualCommonMode",
          label: "Residual Common Mode",
          valueType: { type: "number" },
        },
        {
          id: "differentialOutput",
          label: "Differential Output",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegCommonmodeRejectionSignalRatioTool.execute;
export default eegCommonmodeRejectionSignalRatioTool;
