import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly innerWidth: number;
  readonly innerLength: number;
  readonly wallOffset: number;
};
export type Output = {
  readonly outerWidth: number;
  readonly outerLength: number;
  readonly areaDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerWidth: { type: "number", minimum: 0 },
    innerLength: { type: "number", minimum: 0 },
    wallOffset: { type: "number", minimum: 0 },
  },
  required: ["innerWidth", "innerLength", "wallOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerWidth: { type: "number" },
    outerLength: { type: "number" },
    areaDifference: { type: "number" },
  },
  required: ["outerWidth", "outerLength", "areaDifference"],
} as const;
/** Rectangular four-wall offset; caller chooses the measurement reference rather than assuming a floor-area standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { innerWidth, innerLength, wallOffset } = request;
  const compute = (): Output => {
    H.domain(innerWidth >= 0 && innerLength >= 0 && wallOffset >= 0);
    return {
      outerWidth: innerWidth + 2 * wallOffset,
      outerLength: innerLength + 2 * wallOffset,
      areaDifference:
        (innerWidth + 2 * wallOffset) * (innerLength + 2 * wallOffset) -
        innerWidth * innerLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { innerWidth: 10, innerLength: 20, wallOffset: 0.5 },
  output: { outerWidth: 11, outerLength: 21, areaDifference: 31 },
} satisfies ToolExample<Input, Output>;
export const propertyMeasurementWallLineOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/property-measurement-wall-line-offset",
    title: "Property Measurement Wall Line Offset Tool",
    description:
      "Rectangular four-wall offset; caller chooses the measurement reference rather than assuming a floor-area standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerWidth: { type: "number", minimum: 0 },
        innerLength: { type: "number", minimum: 0 },
        wallOffset: { type: "number", minimum: 0 },
      },
      required: ["innerWidth", "innerLength", "wallOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerWidth: { type: "number" },
        outerLength: { type: "number" },
        areaDifference: { type: "number" },
      },
      required: ["outerWidth", "outerLength", "areaDifference"],
    },
    ports: {
      inputs: [
        {
          id: "innerWidth",
          label: "Inner Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "innerLength",
          label: "Inner Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wallOffset",
          label: "Wall Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outerWidth",
          label: "Outer Width",
          valueType: { type: "number" },
        },
        {
          id: "outerLength",
          label: "Outer Length",
          valueType: { type: "number" },
        },
        {
          id: "areaDifference",
          label: "Area Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = propertyMeasurementWallLineOffsetTool.execute;
export default propertyMeasurementWallLineOffsetTool;
