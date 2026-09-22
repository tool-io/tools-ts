import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bottomWidth: number;
  readonly bottomLength: number;
  readonly depth: number;
  readonly slopeRunPerRise: number;
};
export type Output = {
  readonly sideArea: number;
  readonly bottomArea: number;
  readonly totalArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bottomWidth: { type: "number", minimum: 0 },
    bottomLength: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    slopeRunPerRise: { type: "number", minimum: 0 },
  },
  required: ["bottomWidth", "bottomLength", "depth", "slopeRunPerRise"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sideArea: { type: "number" },
    bottomArea: { type: "number" },
    totalArea: { type: "number" },
  },
  required: ["sideArea", "bottomArea", "totalArea"],
} as const;
/** Rectangular bottom and four trapezoidal side faces with uniform outward side slope; excludes seams and anchoring allowance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bottomWidth, bottomLength, depth, slopeRunPerRise } = request;
  const compute = (): Output => {
    H.domain(
      bottomWidth >= 0 &&
        bottomLength >= 0 &&
        depth >= 0 &&
        slopeRunPerRise >= 0,
    );
    return {
      sideArea:
        2 *
        depth *
        Math.hypot(1, slopeRunPerRise) *
        (bottomWidth + bottomLength + 2 * depth * slopeRunPerRise),
      bottomArea: bottomWidth * bottomLength,
      totalArea:
        bottomWidth * bottomLength +
        2 *
          depth *
          Math.hypot(1, slopeRunPerRise) *
          (bottomWidth + bottomLength + 2 * depth * slopeRunPerRise),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bottomWidth: 4, bottomLength: 6, depth: 2, slopeRunPerRise: 0 },
  output: { sideArea: 40, bottomArea: 24, totalArea: 64 },
} satisfies ToolExample<Input, Output>;
export const pondLinerSidewallAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/pond-liner-sidewall-area-term",
    title: "Pond Liner Sidewall Area Term Tool",
    description:
      "Rectangular bottom and four trapezoidal side faces with uniform outward side slope; excludes seams and anchoring allowance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bottomWidth: { type: "number", minimum: 0 },
        bottomLength: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        slopeRunPerRise: { type: "number", minimum: 0 },
      },
      required: ["bottomWidth", "bottomLength", "depth", "slopeRunPerRise"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sideArea: { type: "number" },
        bottomArea: { type: "number" },
        totalArea: { type: "number" },
      },
      required: ["sideArea", "bottomArea", "totalArea"],
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
          id: "bottomLength",
          label: "Bottom Length",
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
          id: "slopeRunPerRise",
          label: "Slope Run Per Rise",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "sideArea", label: "Side Area", valueType: { type: "number" } },
        {
          id: "bottomArea",
          label: "Bottom Area",
          valueType: { type: "number" },
        },
        { id: "totalArea", label: "Total Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pondLinerSidewallAreaTermTool.execute;
export default pondLinerSidewallAreaTermTool;
