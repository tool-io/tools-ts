import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly moment: number; readonly volume: number };
export type Output = { readonly magnetization: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moment: { type: "number" },
    volume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["moment", "volume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { magnetization: { type: "number" } },
  required: ["magnetization"],
} as const;
/** Convert ampere square metres to amperes per metre using cubic metres of material. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moment, volume } = request;
  const compute = (): Output => {
    H.positive(volume);
    return { magnetization: moment / volume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { moment: 0.02, volume: 0.001 },
  output: { magnetization: 20 },
} satisfies ToolExample<Input, Output>;
export const magneticMomentMagnetizationVolumeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/magnetic-moment-magnetization-volume-factor",
      title: "Magnetic Moment Magnetization Volume Factor Tool",
      description:
        "Convert ampere square metres to amperes per metre using cubic metres of material.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          moment: { type: "number" },
          volume: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["moment", "volume"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { magnetization: { type: "number" } },
        required: ["magnetization"],
      },
      ports: {
        inputs: [
          {
            id: "moment",
            label: "Moment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volume",
            label: "Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "magnetization",
            label: "Magnetization",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = magneticMomentMagnetizationVolumeFactorTool.execute;
export default magneticMomentMagnetizationVolumeFactorTool;
