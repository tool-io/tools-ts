import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bottomWidth: number;
  readonly depth: number;
  readonly sideSlope: number;
};
export type Output = {
  readonly area: number;
  readonly wettedPerimeter: number;
  readonly hydraulicRadius: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bottomWidth: { type: "number", minimum: 0 },
    depth: { type: "number", exclusiveMinimum: 0 },
    sideSlope: { type: "number", minimum: 0 },
  },
  required: ["bottomWidth", "depth", "sideSlope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number" },
    wettedPerimeter: { type: "number" },
    hydraulicRadius: { type: "number" },
  },
  required: ["area", "wettedPerimeter", "hydraulicRadius"],
} as const;
/** Calculate stream section trapezoid wetted perimeter from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bottomWidth, depth, sideSlope } = request;
  const compute = (): Output => {
    H.domain(bottomWidth >= 0 && depth > 0 && sideSlope >= 0);
    H.positive(bottomWidth + sideSlope);
    return {
      area: depth * (bottomWidth + sideSlope * depth),
      wettedPerimeter: bottomWidth + 2 * depth * Math.hypot(1, sideSlope),
      hydraulicRadius:
        (depth * (bottomWidth + sideSlope * depth)) /
        (bottomWidth + 2 * depth * Math.hypot(1, sideSlope)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bottomWidth: 4, depth: 2, sideSlope: 0 },
  output: { area: 8, wettedPerimeter: 8, hydraulicRadius: 1 },
} satisfies ToolExample<Input, Output>;
export const streamSectionTrapezoidWettedPerimeterTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrology/stream-section-trapezoid-wetted-perimeter",
      title: "Stream Section Trapezoid Wetted Perimeter Tool",
      description:
        "Calculate stream section trapezoid wetted perimeter from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bottomWidth: { type: "number", minimum: 0 },
          depth: { type: "number", exclusiveMinimum: 0 },
          sideSlope: { type: "number", minimum: 0 },
        },
        required: ["bottomWidth", "depth", "sideSlope"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "number" },
          wettedPerimeter: { type: "number" },
          hydraulicRadius: { type: "number" },
        },
        required: ["area", "wettedPerimeter", "hydraulicRadius"],
      },
      ports: {
        inputs: [
          {
            id: "bottomWidth",
            label: "Bottom Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "depth",
            label: "Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sideSlope",
            label: "Side Slope",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "area", label: "Area", valueType: { type: "number" } },
          {
            id: "wettedPerimeter",
            label: "Wetted Perimeter",
            valueType: { type: "number" },
          },
          {
            id: "hydraulicRadius",
            label: "Hydraulic Radius",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = streamSectionTrapezoidWettedPerimeterTool.execute;
export default streamSectionTrapezoidWettedPerimeterTool;
