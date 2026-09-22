import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sheetWidth: number;
  readonly sheetHeight: number;
  readonly plateWidth: number;
  readonly plateHeight: number;
};
export type Output = {
  readonly horizontalMargin: number;
  readonly verticalMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sheetWidth: { type: "number" },
    sheetHeight: { type: "number" },
    plateWidth: { type: "number", minimum: 0 },
    plateHeight: { type: "number", minimum: 0 },
  },
  required: ["sheetWidth", "sheetHeight", "plateWidth", "plateHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalMargin: { type: "number" },
    verticalMargin: { type: "number" },
  },
  required: ["horizontalMargin", "verticalMargin"],
} as const;
/** Assume a centered rectangular plate mark. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sheetWidth, sheetHeight, plateWidth, plateHeight } = request;
  const compute = (): Output => {
    H.domain(
      plateWidth >= 0 &&
        plateHeight >= 0 &&
        sheetWidth >= plateWidth &&
        sheetHeight >= plateHeight,
    );
    return {
      horizontalMargin: (sheetWidth - plateWidth) / 2,
      verticalMargin: (sheetHeight - plateHeight) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sheetWidth: 40, sheetHeight: 50, plateWidth: 30, plateHeight: 40 },
  output: { horizontalMargin: 5, verticalMargin: 5 },
} satisfies ToolExample<Input, Output>;
export const printPlateMarkSheetMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/print-plate-mark-sheet-margin",
    title: "Print Plate Mark Sheet Margin Tool",
    description: "Assume a centered rectangular plate mark.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sheetWidth: { type: "number" },
        sheetHeight: { type: "number" },
        plateWidth: { type: "number", minimum: 0 },
        plateHeight: { type: "number", minimum: 0 },
      },
      required: ["sheetWidth", "sheetHeight", "plateWidth", "plateHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalMargin: { type: "number" },
        verticalMargin: { type: "number" },
      },
      required: ["horizontalMargin", "verticalMargin"],
    },
    ports: {
      inputs: [
        {
          id: "sheetWidth",
          label: "Sheet Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sheetHeight",
          label: "Sheet Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plateWidth",
          label: "Plate Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plateHeight",
          label: "Plate Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontalMargin",
          label: "Horizontal Margin",
          valueType: { type: "number" },
        },
        {
          id: "verticalMargin",
          label: "Vertical Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = printPlateMarkSheetMarginTool.execute;
export default printPlateMarkSheetMarginTool;
