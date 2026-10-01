import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly dark: number;
  readonly reference: number;
  readonly target: number;
};
export type Output = {
  readonly darkCorrected: number;
  readonly relativeResponse: number;
  readonly gainCorrection: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    dark: { type: "number" },
    reference: { type: "number" },
    target: { type: "number" },
  },
  required: ["measured", "dark", "reference", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    darkCorrected: { type: "number" },
    relativeResponse: { type: "number" },
    gainCorrection: { type: "number" },
  },
  required: ["darkCorrected", "relativeResponse", "gainCorrection"],
} as const;
/** Calculate optometry device photometric reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, dark, reference, target } = request;
  const compute = (): Output => {
    H.domain(reference !== dark);
    return {
      darkCorrected: measured - dark,
      relativeResponse: (measured - dark) / (reference - dark),
      gainCorrection: target / (reference - dark),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 120, dark: 20, reference: 220, target: 100 },
  output: { darkCorrected: 100, relativeResponse: 0.5, gainCorrection: 0.5 },
} satisfies ToolExample<Input, Output>;
export const optometryDevicePhotometricReferenceGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "optometry/optometry-device-photometric-reference-gap",
      title: "Optometry Device Photometric Reference Gap Tool",
      description:
        "Calculate optometry device photometric reference gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measured: { type: "number" },
          dark: { type: "number" },
          reference: { type: "number" },
          target: { type: "number" },
        },
        required: ["measured", "dark", "reference", "target"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          darkCorrected: { type: "number" },
          relativeResponse: { type: "number" },
          gainCorrection: { type: "number" },
        },
        required: ["darkCorrected", "relativeResponse", "gainCorrection"],
      },
      ports: {
        inputs: [
          {
            id: "measured",
            label: "Measured",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dark",
            label: "Dark",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reference",
            label: "Reference",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "target",
            label: "Target",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "darkCorrected",
            label: "Dark Corrected",
            valueType: { type: "number" },
          },
          {
            id: "relativeResponse",
            label: "Relative Response",
            valueType: { type: "number" },
          },
          {
            id: "gainCorrection",
            label: "Gain Correction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = optometryDevicePhotometricReferenceGapTool.execute;
export default optometryDevicePhotometricReferenceGapTool;
