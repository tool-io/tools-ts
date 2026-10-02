import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly digitalNumber: number;
  readonly darkNumber: number;
  readonly gain: number;
  readonly intercept: number;
};
export type Output = { readonly calibratedReflectance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digitalNumber: { type: "number" },
    darkNumber: { type: "number" },
    gain: { type: "number" },
    intercept: { type: "number" },
  },
  required: ["digitalNumber", "darkNumber", "gain", "intercept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { calibratedReflectance: { type: "number" } },
  required: ["calibratedReflectance"],
} as const;
/** Apply an explicit affine band calibration without atmospheric correction or clipping. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digitalNumber, darkNumber, gain, intercept } = request;
  const compute = (): Output => {
    return {
      calibratedReflectance: gain * (digitalNumber - darkNumber) + intercept,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digitalNumber: 120, darkNumber: 20, gain: 0.005, intercept: 0.01 },
  output: { calibratedReflectance: 0.51 },
} satisfies ToolExample<Input, Output>;
export const multispectralBandReflectanceGainTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "precision-agriculture/multispectral-band-reflectance-gain-term",
      title: "Multispectral Band Reflectance Gain Term Tool",
      description:
        "Apply an explicit affine band calibration without atmospheric correction or clipping.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          digitalNumber: { type: "number" },
          darkNumber: { type: "number" },
          gain: { type: "number" },
          intercept: { type: "number" },
        },
        required: ["digitalNumber", "darkNumber", "gain", "intercept"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { calibratedReflectance: { type: "number" } },
        required: ["calibratedReflectance"],
      },
      ports: {
        inputs: [
          {
            id: "digitalNumber",
            label: "Digital Number",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "darkNumber",
            label: "Dark Number",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gain",
            label: "Gain",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "intercept",
            label: "Intercept",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "calibratedReflectance",
            label: "Calibrated Reflectance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = multispectralBandReflectanceGainTermTool.execute;
export default multispectralBandReflectanceGainTermTool;
