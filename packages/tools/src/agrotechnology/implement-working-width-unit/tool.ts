import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly width: number; readonly inputUnit: string };
export type Output = { readonly meters: number; readonly centimeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    inputUnit: { type: "string", maxLength: 8192, enum: ["m", "cm"] },
  },
  required: ["width", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meters: { type: "number" }, centimeters: { type: "number" } },
  required: ["meters", "centimeters"],
} as const;
/** Convert an explicit implement working width between meters and centimeters without estimating field capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, inputUnit } = request;
  const compute = (): Output => {
    H.domain(width >= 0, "width");
    H.domain(["m", "cm"].includes(inputUnit), "inputUnit");
    return {
      meters: inputUnit === "cm" ? width / 100 : width,
      centimeters: inputUnit === "m" ? width * 100 : width,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 2.4, inputUnit: "m" },
  output: { meters: 2.4, centimeters: 240 },
} satisfies ToolExample<Input, Output>;
export const implementWorkingWidthUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrotechnology", "agriculture"],
      keywords: ["agrotechnology", "agriculture"],
    },
    id: "agrotechnology/implement-working-width-unit",
    title: "Implement Working Width Unit",
    description:
      "Convert an explicit implement working width between meters and centimeters without estimating field capacity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        inputUnit: { type: "string", maxLength: 8192, enum: ["m", "cm"] },
      },
      required: ["width", "inputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meters: { type: "number" },
        centimeters: { type: "number" },
      },
      required: ["meters", "centimeters"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "meters", label: "Meters", valueType: { type: "number" } },
        {
          id: "centimeters",
          label: "Centimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = implementWorkingWidthUnitTool.execute;
export default implementWorkingWidthUnitTool;
