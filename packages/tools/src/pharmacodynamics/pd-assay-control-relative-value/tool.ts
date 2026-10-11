import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assayValue: number;
  readonly controlValue: number;
};
export type Output = { readonly relativeValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assayValue: { type: "number" },
    controlValue: { type: "number" },
  },
  required: ["assayValue", "controlValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeValue: { type: "number" } },
  required: ["relativeValue"],
} as const;
/** Divide an explicit assay value by a nonzero supplied control on the same scale, preserving signed values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assayValue, controlValue } = request;
  const compute = (): Output => {
    H.domain(controlValue !== 0, "controlValue");
    return { relativeValue: assayValue / controlValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assayValue: 6, controlValue: 4 },
  output: { relativeValue: 1.5 },
} satisfies ToolExample<Input, Output>;
export const pdAssayControlRelativeValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacodynamics", "pharmacy"],
      keywords: ["pharmacodynamics", "pharmacy"],
    },
    id: "pharmacodynamics/pd-assay-control-relative-value",
    title: "PD Assay Control Relative Value",
    description:
      "Divide an explicit assay value by a nonzero supplied control on the same scale, preserving signed values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assayValue: { type: "number" },
        controlValue: { type: "number" },
      },
      required: ["assayValue", "controlValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeValue: { type: "number" } },
      required: ["relativeValue"],
    },
    ports: {
      inputs: [
        {
          id: "assayValue",
          label: "Assay Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "controlValue",
          label: "Control Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeValue",
          label: "Relative Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdAssayControlRelativeValueTool.execute;
export default pdAssayControlRelativeValueTool;
