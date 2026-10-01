import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly firstOriginRow: number;
  readonly firstOriginColumn: number;
  readonly secondOriginRow: number;
  readonly secondOriginColumn: number;
};
export type Output = {
  readonly firstRelativeRowDecimal: string;
  readonly firstRelativeColumnDecimal: string;
  readonly secondRelativeRowDecimal: string;
  readonly secondRelativeColumnDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer" },
    column: { type: "integer" },
    firstOriginRow: { type: "integer" },
    firstOriginColumn: { type: "integer" },
    secondOriginRow: { type: "integer" },
    secondOriginColumn: { type: "integer" },
  },
  required: [
    "row",
    "column",
    "firstOriginRow",
    "firstOriginColumn",
    "secondOriginRow",
    "secondOriginColumn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRelativeRowDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    firstRelativeColumnDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    secondRelativeRowDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    secondRelativeColumnDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: [
    "firstRelativeRowDecimal",
    "firstRelativeColumnDecimal",
    "secondRelativeRowDecimal",
    "secondRelativeColumnDecimal",
  ],
} as const;
/** Calculate visual grid origin gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    row,
    column,
    firstOriginRow,
    firstOriginColumn,
    secondOriginRow,
    secondOriginColumn,
  } = request;
  const compute = (): Output => {
    return {
      firstRelativeRowDecimal: (
        BigInt(row) - BigInt(firstOriginRow)
      ).toString(),
      firstRelativeColumnDecimal: (
        BigInt(column) - BigInt(firstOriginColumn)
      ).toString(),
      secondRelativeRowDecimal: (
        BigInt(row) - BigInt(secondOriginRow)
      ).toString(),
      secondRelativeColumnDecimal: (
        BigInt(column) - BigInt(secondOriginColumn)
      ).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    row: 5,
    column: 8,
    firstOriginRow: 1,
    firstOriginColumn: 1,
    secondOriginRow: 3,
    secondOriginColumn: 4,
  },
  output: {
    firstRelativeRowDecimal: "4",
    firstRelativeColumnDecimal: "7",
    secondRelativeRowDecimal: "2",
    secondRelativeColumnDecimal: "4",
  },
} satisfies ToolExample<Input, Output>;
export const visualGridOriginGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "ophthalmology/visual-grid-origin-gap",
      title: "Visual Grid Origin Gap Tool",
      description:
        "Calculate visual grid origin gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          row: { type: "integer" },
          column: { type: "integer" },
          firstOriginRow: { type: "integer" },
          firstOriginColumn: { type: "integer" },
          secondOriginRow: { type: "integer" },
          secondOriginColumn: { type: "integer" },
        },
        required: [
          "row",
          "column",
          "firstOriginRow",
          "firstOriginColumn",
          "secondOriginRow",
          "secondOriginColumn",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstRelativeRowDecimal: {
            type: "string",
            maxLength: 8192,
            format: "integer-decimal",
          },
          firstRelativeColumnDecimal: {
            type: "string",
            maxLength: 8192,
            format: "integer-decimal",
          },
          secondRelativeRowDecimal: {
            type: "string",
            maxLength: 8192,
            format: "integer-decimal",
          },
          secondRelativeColumnDecimal: {
            type: "string",
            maxLength: 8192,
            format: "integer-decimal",
          },
        },
        required: [
          "firstRelativeRowDecimal",
          "firstRelativeColumnDecimal",
          "secondRelativeRowDecimal",
          "secondRelativeColumnDecimal",
        ],
      },
      ports: {
        inputs: [
          {
            id: "row",
            label: "Row",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "column",
            label: "Column",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstOriginRow",
            label: "First Origin Row",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstOriginColumn",
            label: "First Origin Column",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondOriginRow",
            label: "Second Origin Row",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondOriginColumn",
            label: "Second Origin Column",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "firstRelativeRowDecimal",
            label: "First Relative Row Decimal",
            valueType: { type: "string", format: "integer-decimal" },
          },
          {
            id: "firstRelativeColumnDecimal",
            label: "First Relative Column Decimal",
            valueType: { type: "string", format: "integer-decimal" },
          },
          {
            id: "secondRelativeRowDecimal",
            label: "Second Relative Row Decimal",
            valueType: { type: "string", format: "integer-decimal" },
          },
          {
            id: "secondRelativeColumnDecimal",
            label: "Second Relative Column Decimal",
            valueType: { type: "string", format: "integer-decimal" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = visualGridOriginGapTool.execute;
export default visualGridOriginGapTool;
