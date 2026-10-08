import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axisLengths: readonly number[];
  readonly inputUnit: string;
};
export type Output = { readonly millimeterLengths: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisLengths: { type: "array", maxItems: 256, items: { type: "number" } },
    inputUnit: { type: "string", maxLength: 8192, enum: ["mm", "cm"] },
  },
  required: ["axisLengths", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    millimeterLengths: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["millimeterLengths"],
} as const;
/** Convert three explicitly supplied ultrasound axis lengths between centimeters and millimeters without calculating a thyroid assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisLengths, inputUnit } = request;
  const compute = (): Output => {
    H.domain(
      axisLengths.length === 3 && axisLengths.every((v) => v >= 0),
      "axisLengths",
    );
    H.domain(["mm", "cm"].includes(inputUnit), "inputUnit");
    return {
      millimeterLengths: axisLengths.map((v) =>
        inputUnit === "cm" ? v * 10 : v,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axisLengths: [1.2, 0.8, 2], inputUnit: "cm" },
  output: { millimeterLengths: [12, 8, 20] },
} satisfies ToolExample<Input, Output>;
export const thyroidUltrasoundAxisUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endocrinology", "health and medicine"],
      keywords: ["endocrinology", "health and medicine"],
    },
    id: "endocrinology/thyroid-ultrasound-axis-unit",
    title: "Thyroid Ultrasound Axis Unit",
    description:
      "Convert three explicitly supplied ultrasound axis lengths between centimeters and millimeters without calculating a thyroid assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        inputUnit: { type: "string", maxLength: 8192, enum: ["mm", "cm"] },
      },
      required: ["axisLengths", "inputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        millimeterLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["millimeterLengths"],
    },
    ports: {
      inputs: [
        {
          id: "axisLengths",
          label: "Axis Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "millimeterLengths",
          label: "Millimeter Lengths",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = thyroidUltrasoundAxisUnitTool.execute;
export default thyroidUltrasoundAxisUnitTool;
