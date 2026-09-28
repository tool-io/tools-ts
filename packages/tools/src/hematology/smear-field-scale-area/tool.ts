import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldPixelArea: number;
  readonly lengthPerPixel: number;
};
export type Output = { readonly physicalArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldPixelArea: { type: "integer", minimum: 0 },
    lengthPerPixel: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["fieldPixelArea", "lengthPerPixel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { physicalArea: { type: "number" } },
  required: ["physicalArea"],
} as const;
/** Calculate smear field scale area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldPixelArea, lengthPerPixel } = request;
  const compute = (): Output => {
    H.integer(fieldPixelArea, 0);
    H.positive(lengthPerPixel);
    return { physicalArea: fieldPixelArea * lengthPerPixel ** 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldPixelArea: 100, lengthPerPixel: 0.2 },
  output: { physicalArea: 4.000000000000001 },
} satisfies ToolExample<Input, Output>;
export const smearFieldScaleAreaTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "hematology/smear-field-scale-area",
      title: "Smear Field Scale Area Tool",
      description:
        "Calculate smear field scale area from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fieldPixelArea: { type: "integer", minimum: 0 },
          lengthPerPixel: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["fieldPixelArea", "lengthPerPixel"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { physicalArea: { type: "number" } },
        required: ["physicalArea"],
      },
      ports: {
        inputs: [
          {
            id: "fieldPixelArea",
            label: "Field Pixel Area",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "lengthPerPixel",
            label: "Length Per Pixel",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "physicalArea",
            label: "Physical Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = smearFieldScaleAreaTool.execute;
export default smearFieldScaleAreaTool;
