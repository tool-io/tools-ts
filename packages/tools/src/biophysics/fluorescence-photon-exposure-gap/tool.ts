import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signalPhotons: number;
  readonly backgroundPhotons: number;
  readonly exposureDuration: number;
  readonly referenceRate: number;
};
export type Output = {
  readonly netPhotons: number;
  readonly correctedRate: number;
  readonly rateGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signalPhotons: { type: "number", minimum: 0 },
    backgroundPhotons: { type: "number", minimum: 0 },
    exposureDuration: { type: "number", exclusiveMinimum: 0 },
    referenceRate: { type: "number" },
  },
  required: [
    "signalPhotons",
    "backgroundPhotons",
    "exposureDuration",
    "referenceRate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netPhotons: { type: "number" },
    correctedRate: { type: "number" },
    rateGap: { type: "number" },
  },
  required: ["netPhotons", "correctedRate", "rateGap"],
} as const;
/** Calculate fluorescence photon exposure gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signalPhotons, backgroundPhotons, exposureDuration, referenceRate } =
    request;
  const compute = (): Output => {
    H.domain(signalPhotons >= 0 && backgroundPhotons >= 0);
    H.positive(exposureDuration);
    return {
      netPhotons: signalPhotons - backgroundPhotons,
      correctedRate: (signalPhotons - backgroundPhotons) / exposureDuration,
      rateGap:
        (signalPhotons - backgroundPhotons) / exposureDuration - referenceRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signalPhotons: 100,
    backgroundPhotons: 20,
    exposureDuration: 4,
    referenceRate: 15,
  },
  output: { netPhotons: 80, correctedRate: 20, rateGap: 5 },
} satisfies ToolExample<Input, Output>;
export const fluorescencePhotonExposureGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/fluorescence-photon-exposure-gap",
    title: "Fluorescence Photon Exposure Gap Tool",
    description:
      "Calculate fluorescence photon exposure gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signalPhotons: { type: "number", minimum: 0 },
        backgroundPhotons: { type: "number", minimum: 0 },
        exposureDuration: { type: "number", exclusiveMinimum: 0 },
        referenceRate: { type: "number" },
      },
      required: [
        "signalPhotons",
        "backgroundPhotons",
        "exposureDuration",
        "referenceRate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netPhotons: { type: "number" },
        correctedRate: { type: "number" },
        rateGap: { type: "number" },
      },
      required: ["netPhotons", "correctedRate", "rateGap"],
    },
    ports: {
      inputs: [
        {
          id: "signalPhotons",
          label: "Signal Photons",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backgroundPhotons",
          label: "Background Photons",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposureDuration",
          label: "Exposure Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceRate",
          label: "Reference Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netPhotons",
          label: "Net Photons",
          valueType: { type: "number" },
        },
        {
          id: "correctedRate",
          label: "Corrected Rate",
          valueType: { type: "number" },
        },
        { id: "rateGap", label: "Rate Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fluorescencePhotonExposureGapTool.execute;
export default fluorescencePhotonExposureGapTool;
