import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pivot: number;
  readonly rowCoupling: number;
  readonly columnCoupling: number;
  readonly corner: number;
};
export type Output = {
  readonly schurDefined: boolean;
  readonly schurValue: number;
  readonly obstructed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pivot: { type: "number" },
    rowCoupling: { type: "number" },
    columnCoupling: { type: "number" },
    corner: { type: "number" },
  },
  required: ["pivot", "rowCoupling", "columnCoupling", "corner"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    schurDefined: { type: "boolean" },
    schurValue: { type: "number" },
    obstructed: { type: "boolean" },
  },
  required: ["schurDefined", "schurValue", "obstructed"],
} as const;
/** Scalar Schur-complement pivot witness; unavailable Schur values use a flagged zero placeholder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pivot, rowCoupling, columnCoupling, corner } = request;
  const compute = (): Output => {
    const schurDefined = pivot !== 0;
    return {
      schurDefined,
      schurValue: schurDefined
        ? corner - (columnCoupling * rowCoupling) / pivot
        : 0,
      obstructed: !schurDefined && (rowCoupling !== 0 || columnCoupling !== 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pivot: 2, rowCoupling: 3, columnCoupling: 4, corner: 10 },
  output: { schurDefined: true, schurValue: 4, obstructed: false },
} satisfies ToolExample<Input, Output>;
export const matrixSchurPivotZeroWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-schur-pivot-zero-witness",
    title: "Matrix Schur Pivot Zero Witness Tool",
    description:
      "Scalar Schur-complement pivot witness; unavailable Schur values use a flagged zero placeholder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pivot: { type: "number" },
        rowCoupling: { type: "number" },
        columnCoupling: { type: "number" },
        corner: { type: "number" },
      },
      required: ["pivot", "rowCoupling", "columnCoupling", "corner"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        schurDefined: { type: "boolean" },
        schurValue: { type: "number" },
        obstructed: { type: "boolean" },
      },
      required: ["schurDefined", "schurValue", "obstructed"],
    },
    ports: {
      inputs: [
        {
          id: "pivot",
          label: "Pivot",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rowCoupling",
          label: "Row Coupling",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columnCoupling",
          label: "Column Coupling",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "corner",
          label: "Corner",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "schurDefined",
          label: "Schur Defined",
          valueType: { type: "boolean" },
        },
        {
          id: "schurValue",
          label: "Schur Value",
          valueType: { type: "number" },
        },
        {
          id: "obstructed",
          label: "Obstructed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixSchurPivotZeroWitnessTool.execute;
export default matrixSchurPivotZeroWitnessTool;
