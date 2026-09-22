import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly barPixels: number;
  readonly barLength: number;
  readonly objectPixels: number;
};
export type Output = {
  readonly lengthPerPixel: number;
  readonly objectLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    barPixels: { type: "number", exclusiveMinimum: 0 },
    barLength: { type: "number", minimum: 0 },
    objectPixels: { type: "number", minimum: 0 },
  },
  required: ["barPixels", "barLength", "objectPixels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthPerPixel: { type: "number" },
    objectLength: { type: "number" },
  },
  required: ["lengthPerPixel", "objectLength"],
} as const;
/** Calculate microscope scale bar object length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { barPixels, barLength, objectPixels } = request;
  const compute = (): Output => {
    H.positive(barPixels);
    H.domain(barLength >= 0 && objectPixels >= 0);
    return {
      lengthPerPixel: barLength / barPixels,
      objectLength: (objectPixels * barLength) / barPixels,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { barPixels: 100, barLength: 10, objectPixels: 250 },
  output: { lengthPerPixel: 0.1, objectLength: 25 },
} satisfies ToolExample<Input, Output>;
export const microscopeScaleBarObjectLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/microscope-scale-bar-object-length",
    title: "Microscope Scale Bar Object Length Tool",
    description:
      "Calculate microscope scale bar object length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        barPixels: { type: "number", exclusiveMinimum: 0 },
        barLength: { type: "number", minimum: 0 },
        objectPixels: { type: "number", minimum: 0 },
      },
      required: ["barPixels", "barLength", "objectPixels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengthPerPixel: { type: "number" },
        objectLength: { type: "number" },
      },
      required: ["lengthPerPixel", "objectLength"],
    },
    ports: {
      inputs: [
        {
          id: "barPixels",
          label: "Bar Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "barLength",
          label: "Bar Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "objectPixels",
          label: "Object Pixels",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lengthPerPixel",
          label: "Length Per Pixel",
          valueType: { type: "number" },
        },
        {
          id: "objectLength",
          label: "Object Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = microscopeScaleBarObjectLengthTool.execute;
export default microscopeScaleBarObjectLengthTool;
