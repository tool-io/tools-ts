import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly measuredLength: number;
  readonly unitText: string;
  readonly axisWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    measuredLength: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
    axisWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "measuredLength", "unitText", "axisWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit stone-axis measurement without estimating stone volume or choosing management. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, measuredLength, unitText, axisWording } = request;
  const compute = (): Output => {
    H.domain(
      recordId.length > 0 && unitText.length > 0 && axisWording.length > 0,
      "recordId",
    );
    H.domain(measuredLength >= 0, "measuredLength");
    return {
      label:
        recordId + "; " + axisWording + "=" + measuredLength + " " + unitText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "S17",
    measuredLength: 5,
    unitText: "mm",
    axisWording: "long axis",
  },
  output: { label: "S17; long axis=5 mm" },
} satisfies ToolExample<Input, Output>;
export const urologicalStoneAxisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["urology", "health and medicine"],
      keywords: ["urology", "health and medicine"],
    },
    id: "urology/urological-stone-axis-label",
    title: "Urological Stone Axis Label",
    description:
      "Label an explicit stone-axis measurement without estimating stone volume or choosing management.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        measuredLength: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
        axisWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "measuredLength", "unitText", "axisWording"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "measuredLength",
          label: "Measured Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "axisWording",
          label: "Axis Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = urologicalStoneAxisLabelTool.execute;
export default urologicalStoneAxisLabelTool;
