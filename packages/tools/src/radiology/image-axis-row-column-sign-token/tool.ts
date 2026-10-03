import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowCoordinate: number;
  readonly columnCoordinate: number;
  readonly reverseRow: boolean;
  readonly reverseColumn: boolean;
  readonly swapAxes: boolean;
};
export type Output = { readonly first: number; readonly second: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowCoordinate: { type: "number" },
    columnCoordinate: { type: "number" },
    reverseRow: { type: "boolean" },
    reverseColumn: { type: "boolean" },
    swapAxes: { type: "boolean" },
  },
  required: [
    "rowCoordinate",
    "columnCoordinate",
    "reverseRow",
    "reverseColumn",
    "swapAxes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { first: { type: "number" }, second: { type: "number" } },
  required: ["first", "second"],
} as const;
/** Apply explicit array-axis swap and sign flags without deriving patient orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rowCoordinate,
    columnCoordinate,
    reverseRow,
    reverseColumn,
    swapAxes,
  } = request;
  const compute = (): Output => {
    return {
      first: swapAxes
        ? columnCoordinate * (reverseColumn ? -1 : 1)
        : rowCoordinate * (reverseRow ? -1 : 1),
      second: swapAxes
        ? rowCoordinate * (reverseRow ? -1 : 1)
        : columnCoordinate * (reverseColumn ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rowCoordinate: 2,
    columnCoordinate: 3,
    reverseRow: true,
    reverseColumn: false,
    swapAxes: true,
  },
  output: { first: 3, second: -2 },
} satisfies ToolExample<Input, Output>;
export const imageAxisRowColumnSignTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/image-axis-row-column-sign-token",
    title: "Image Axis Row Column Sign Token Tool",
    description:
      "Apply explicit array-axis swap and sign flags without deriving patient orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowCoordinate: { type: "number" },
        columnCoordinate: { type: "number" },
        reverseRow: { type: "boolean" },
        reverseColumn: { type: "boolean" },
        swapAxes: { type: "boolean" },
      },
      required: [
        "rowCoordinate",
        "columnCoordinate",
        "reverseRow",
        "reverseColumn",
        "swapAxes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { first: { type: "number" }, second: { type: "number" } },
      required: ["first", "second"],
    },
    ports: {
      inputs: [
        {
          id: "rowCoordinate",
          label: "Row Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columnCoordinate",
          label: "Column Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseRow",
          label: "Reverse Row",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reverseColumn",
          label: "Reverse Column",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "swapAxes",
          label: "Swap Axes",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "first", label: "First", valueType: { type: "number" } },
        { id: "second", label: "Second", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = imageAxisRowColumnSignTokenTool.execute;
export default imageAxisRowColumnSignTokenTool;
