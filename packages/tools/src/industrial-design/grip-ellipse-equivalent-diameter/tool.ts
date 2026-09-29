import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly majorDiameter: number;
  readonly minorDiameter: number;
};
export type Output = { readonly areaEquivalentDiameter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    majorDiameter: { type: "number", exclusiveMinimum: 0 },
    minorDiameter: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["majorDiameter", "minorDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { areaEquivalentDiameter: { type: "number" } },
  required: ["areaEquivalentDiameter"],
} as const;
/** Return the equal-area circular diameter of an elliptical grip cross section. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { majorDiameter, minorDiameter } = request;
  const compute = (): Output => {
    H.positive(majorDiameter);
    H.positive(minorDiameter);
    return { areaEquivalentDiameter: Math.sqrt(majorDiameter * minorDiameter) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { majorDiameter: 16, minorDiameter: 9 },
  output: { areaEquivalentDiameter: 12 },
} satisfies ToolExample<Input, Output>;
export const gripEllipseEquivalentDiameterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/grip-ellipse-equivalent-diameter",
    title: "Grip Ellipse Equivalent Diameter Tool",
    description:
      "Return the equal-area circular diameter of an elliptical grip cross section.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        majorDiameter: { type: "number", exclusiveMinimum: 0 },
        minorDiameter: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["majorDiameter", "minorDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { areaEquivalentDiameter: { type: "number" } },
      required: ["areaEquivalentDiameter"],
    },
    ports: {
      inputs: [
        {
          id: "majorDiameter",
          label: "Major Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minorDiameter",
          label: "Minor Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "areaEquivalentDiameter",
          label: "Area Equivalent Diameter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gripEllipseEquivalentDiameterTool.execute;
export default gripEllipseEquivalentDiameterTool;
