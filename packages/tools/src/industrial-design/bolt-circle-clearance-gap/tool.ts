import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly boltCircleRadius: number;
  readonly holeRadius: number;
  readonly enclosingRadius: number;
  readonly boltCount: number;
};
export type Output = {
  readonly radialMargin: number;
  readonly adjacentHoleMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boltCircleRadius: { type: "number", minimum: 0 },
    holeRadius: { type: "number", minimum: 0 },
    enclosingRadius: { type: "number", minimum: 0 },
    boltCount: { type: "integer", minimum: 2 },
  },
  required: ["boltCircleRadius", "holeRadius", "enclosingRadius", "boltCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radialMargin: { type: "number" },
    adjacentHoleMargin: { type: "number" },
  },
  required: ["radialMargin", "adjacentHoleMargin"],
} as const;
/** Report radial and neighboring-hole clearances for an ideal equally spaced bolt circle; no strength assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { boltCircleRadius, holeRadius, enclosingRadius, boltCount } = request;
  const compute = (): Output => {
    H.domain(boltCircleRadius >= 0 && holeRadius >= 0 && enclosingRadius >= 0);
    H.integer(boltCount, 2);
    return {
      radialMargin: enclosingRadius - boltCircleRadius - holeRadius,
      adjacentHoleMargin:
        2 * boltCircleRadius * Math.sin(Math.PI / boltCount) - 2 * holeRadius,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    boltCircleRadius: 10,
    holeRadius: 1,
    enclosingRadius: 15,
    boltCount: 2,
  },
  output: { radialMargin: 4, adjacentHoleMargin: 18 },
} satisfies ToolExample<Input, Output>;
export const boltCircleClearanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/bolt-circle-clearance-gap",
    title: "Bolt Circle Clearance Gap Tool",
    description:
      "Report radial and neighboring-hole clearances for an ideal equally spaced bolt circle; no strength assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boltCircleRadius: { type: "number", minimum: 0 },
        holeRadius: { type: "number", minimum: 0 },
        enclosingRadius: { type: "number", minimum: 0 },
        boltCount: { type: "integer", minimum: 2 },
      },
      required: [
        "boltCircleRadius",
        "holeRadius",
        "enclosingRadius",
        "boltCount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radialMargin: { type: "number" },
        adjacentHoleMargin: { type: "number" },
      },
      required: ["radialMargin", "adjacentHoleMargin"],
    },
    ports: {
      inputs: [
        {
          id: "boltCircleRadius",
          label: "Bolt Circle Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "holeRadius",
          label: "Hole Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "enclosingRadius",
          label: "Enclosing Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boltCount",
          label: "Bolt Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "radialMargin",
          label: "Radial Margin",
          valueType: { type: "number" },
        },
        {
          id: "adjacentHoleMargin",
          label: "Adjacent Hole Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boltCircleClearanceGapTool.execute;
export default boltCircleClearanceGapTool;
