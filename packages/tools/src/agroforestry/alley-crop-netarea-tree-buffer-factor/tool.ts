import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldArea: number;
  readonly treeRows: number;
  readonly rowLength: number;
  readonly bufferEachSide: number;
};
export type Output = {
  readonly excludedArea: number;
  readonly cropArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldArea: { type: "number", minimum: 0 },
    treeRows: { type: "integer", minimum: 0 },
    rowLength: { type: "number", minimum: 0 },
    bufferEachSide: { type: "number", minimum: 0 },
  },
  required: ["fieldArea", "treeRows", "rowLength", "bufferEachSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excludedArea: { type: "number" },
    cropArea: { type: "number" },
  },
  required: ["excludedArea", "cropArea"],
} as const;
/** Calculate alley crop netarea tree buffer factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldArea, treeRows, rowLength, bufferEachSide } = request;
  const compute = (): Output => {
    H.integer(treeRows, 0);
    H.domain(fieldArea >= 0 && rowLength >= 0 && bufferEachSide >= 0);
    return {
      excludedArea: treeRows * rowLength * 2 * bufferEachSide,
      cropArea: fieldArea - treeRows * rowLength * 2 * bufferEachSide,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldArea: 1000, treeRows: 4, rowLength: 50, bufferEachSide: 1 },
  output: { excludedArea: 400, cropArea: 600 },
} satisfies ToolExample<Input, Output>;
export const alleyCropNetareaTreeBufferFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/alley-crop-netarea-tree-buffer-factor",
    title: "Alley Crop Netarea Tree Buffer Factor Tool",
    description:
      "Calculate alley crop netarea tree buffer factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldArea: { type: "number", minimum: 0 },
        treeRows: { type: "integer", minimum: 0 },
        rowLength: { type: "number", minimum: 0 },
        bufferEachSide: { type: "number", minimum: 0 },
      },
      required: ["fieldArea", "treeRows", "rowLength", "bufferEachSide"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excludedArea: { type: "number" },
        cropArea: { type: "number" },
      },
      required: ["excludedArea", "cropArea"],
    },
    ports: {
      inputs: [
        {
          id: "fieldArea",
          label: "Field Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "treeRows",
          label: "Tree Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowLength",
          label: "Row Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bufferEachSide",
          label: "Buffer Each Side",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "excludedArea",
          label: "Excluded Area",
          valueType: { type: "number" },
        },
        { id: "cropArea", label: "Crop Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = alleyCropNetareaTreeBufferFactorTool.execute;
export default alleyCropNetareaTreeBufferFactorTool;
