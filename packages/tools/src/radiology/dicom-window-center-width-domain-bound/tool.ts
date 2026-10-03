import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly center: number; readonly width: number };
export type Output = {
  readonly lowerBoundary: number;
  readonly upperBoundary: number;
  readonly thresholdOnly: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    center: { type: "number" },
    width: { type: "number", minimum: 1 },
  },
  required: ["center", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerBoundary: { type: "number" },
    upperBoundary: { type: "number" },
    thresholdOnly: { type: "boolean" },
  },
  required: ["lowerBoundary", "upperBoundary", "thresholdOnly"],
} as const;
/** DICOM default LINEAR VOI boundaries c-0.5 plus/minus (w-1)/2; width one is a threshold and this tool does not implement LINEAR_EXACT or SIGMOID. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { center, width } = request;
  const compute = (): Output => {
    H.domain(width >= 1);
    return {
      lowerBoundary: center - 0.5 - (width - 1) / 2,
      upperBoundary: center - 0.5 + (width - 1) / 2,
      thresholdOnly: width === 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { center: 40, width: 400 },
  output: { lowerBoundary: -160, upperBoundary: 239, thresholdOnly: false },
} satisfies ToolExample<Input, Output>;
export const dicomWindowCenterWidthDomainBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/dicom-window-center-width-domain-bound",
    title: "DICOM Window Center Width Domain Bound Tool",
    description:
      "DICOM default LINEAR VOI boundaries c-0.5 plus/minus (w-1)/2; width one is a threshold and this tool does not implement LINEAR_EXACT or SIGMOID.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        center: { type: "number" },
        width: { type: "number", minimum: 1 },
      },
      required: ["center", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerBoundary: { type: "number" },
        upperBoundary: { type: "number" },
        thresholdOnly: { type: "boolean" },
      },
      required: ["lowerBoundary", "upperBoundary", "thresholdOnly"],
    },
    ports: {
      inputs: [
        {
          id: "center",
          label: "Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerBoundary",
          label: "Lower Boundary",
          valueType: { type: "number" },
        },
        {
          id: "upperBoundary",
          label: "Upper Boundary",
          valueType: { type: "number" },
        },
        {
          id: "thresholdOnly",
          label: "Threshold Only",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomWindowCenterWidthDomainBoundTool.execute;
export default dicomWindowCenterWidthDomainBoundTool;
