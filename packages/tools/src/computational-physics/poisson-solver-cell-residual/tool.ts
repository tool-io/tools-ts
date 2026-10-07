import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftValue: number;
  readonly centerValue: number;
  readonly rightValue: number;
  readonly gridSpacing: number;
  readonly suppliedSource: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftValue: { type: "number" },
    centerValue: { type: "number" },
    rightValue: { type: "number" },
    gridSpacing: { type: "number", exclusiveMinimum: 0 },
    suppliedSource: { type: "number" },
  },
  required: [
    "leftValue",
    "centerValue",
    "rightValue",
    "gridSpacing",
    "suppliedSource",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Calculate a one-dimensional centered Laplacian minus source residual for the explicit convention u-double-prime=f. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftValue, centerValue, rightValue, gridSpacing, suppliedSource } =
    request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(gridSpacing) && gridSpacing > 0, "gridSpacing"),
      gridSpacing);
    return {
      residual:
        (leftValue - 2 * centerValue + rightValue) / gridSpacing / gridSpacing -
        suppliedSource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    leftValue: 0,
    centerValue: 1,
    rightValue: 4,
    gridSpacing: 1,
    suppliedSource: 2,
  },
  output: { residual: 0 },
} satisfies ToolExample<Input, Output>;
export const poissonSolverCellResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/poisson-solver-cell-residual",
    title: "Poisson Solver Cell Residual",
    description:
      "Calculate a one-dimensional centered Laplacian minus source residual for the explicit convention u-double-prime=f.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftValue: { type: "number" },
        centerValue: { type: "number" },
        rightValue: { type: "number" },
        gridSpacing: { type: "number", exclusiveMinimum: 0 },
        suppliedSource: { type: "number" },
      },
      required: [
        "leftValue",
        "centerValue",
        "rightValue",
        "gridSpacing",
        "suppliedSource",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" } },
      required: ["residual"],
    },
    ports: {
      inputs: [
        {
          id: "leftValue",
          label: "Left Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerValue",
          label: "Center Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightValue",
          label: "Right Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gridSpacing",
          label: "Grid Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSource",
          label: "Supplied Source",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = poissonSolverCellResidualTool.execute;
export default poissonSolverCellResidualTool;
