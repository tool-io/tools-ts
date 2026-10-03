import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowDirection: readonly number[];
  readonly columnDirection: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly dot: number;
  readonly rowNorm: number;
  readonly columnNorm: number;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowDirection: { type: "array", maxItems: 256, items: { type: "number" } },
    columnDirection: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["rowDirection", "columnDirection", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dot: { type: "number" },
    rowNorm: { type: "number" },
    columnNorm: { type: "number" },
    withinTolerance: { type: "boolean" },
  },
  required: ["dot", "rowNorm", "columnNorm", "withinTolerance"],
} as const;
/** Check supplied DICOM row/column direction cosines for unit lengths and orthogonality using an explicit tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowDirection, columnDirection, tolerance } = request;
  const compute = (): Output => {
    H.domain(
      rowDirection.length === 3 &&
        columnDirection.length === 3 &&
        tolerance >= 0,
    );
    return {
      dot: H.dot(rowDirection, columnDirection),
      rowNorm: Math.hypot(...rowDirection),
      columnNorm: Math.hypot(...columnDirection),
      withinTolerance:
        Math.abs(H.dot(rowDirection, columnDirection)) <= tolerance &&
        Math.abs(Math.hypot(...rowDirection) - 1) <= tolerance &&
        Math.abs(Math.hypot(...columnDirection) - 1) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rowDirection: [1, 0, 0],
    columnDirection: [0, 1, 0],
    tolerance: 0.001,
  },
  output: { dot: 0, rowNorm: 1, columnNorm: 1, withinTolerance: true },
} satisfies ToolExample<Input, Output>;
export const dicomImageOrientationDotOrthogonalityGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "radiology/dicom-image-orientation-dot-orthogonality-gap",
      title: "DICOM Image Orientation Dot Orthogonality Gap Tool",
      description:
        "Check supplied DICOM row/column direction cosines for unit lengths and orthogonality using an explicit tolerance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rowDirection: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          columnDirection: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["rowDirection", "columnDirection", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dot: { type: "number" },
          rowNorm: { type: "number" },
          columnNorm: { type: "number" },
          withinTolerance: { type: "boolean" },
        },
        required: ["dot", "rowNorm", "columnNorm", "withinTolerance"],
      },
      ports: {
        inputs: [
          {
            id: "rowDirection",
            label: "Row Direction",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "columnDirection",
            label: "Column Direction",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "tolerance",
            label: "Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "dot", label: "Dot", valueType: { type: "number" } },
          { id: "rowNorm", label: "Row Norm", valueType: { type: "number" } },
          {
            id: "columnNorm",
            label: "Column Norm",
            valueType: { type: "number" },
          },
          {
            id: "withinTolerance",
            label: "Within Tolerance",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dicomImageOrientationDotOrthogonalityGapTool.execute;
export default dicomImageOrientationDotOrthogonalityGapTool;
