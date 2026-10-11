import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowSpacingMillimeters: number;
  readonly columnSpacingMillimeters: number;
  readonly sliceSpacingMillimeters: number;
};
export type Output = {
  readonly voxelCubicMillimeters: number;
  readonly voxelCubicCentimeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowSpacingMillimeters: { type: "number", exclusiveMinimum: 0 },
    columnSpacingMillimeters: { type: "number", exclusiveMinimum: 0 },
    sliceSpacingMillimeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "rowSpacingMillimeters",
    "columnSpacingMillimeters",
    "sliceSpacingMillimeters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voxelCubicMillimeters: { type: "number" },
    voxelCubicCentimeters: { type: "number" },
  },
  required: ["voxelCubicMillimeters", "voxelCubicCentimeters"],
} as const;
/** Compute a rectangular voxel volume from explicit positive axis spacings without segmenting an image or measuring a lesion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rowSpacingMillimeters,
    columnSpacingMillimeters,
    sliceSpacingMillimeters,
  } = request;
  const compute = (): Output => {
    (H.domain(rowSpacingMillimeters > 0, "rowSpacingMillimeters"),
      rowSpacingMillimeters);
    (H.domain(columnSpacingMillimeters > 0, "columnSpacingMillimeters"),
      columnSpacingMillimeters);
    (H.domain(sliceSpacingMillimeters > 0, "sliceSpacingMillimeters"),
      sliceSpacingMillimeters);
    return (() => {
      const voxelCubicMillimeters =
        rowSpacingMillimeters *
        columnSpacingMillimeters *
        sliceSpacingMillimeters;
      return {
        voxelCubicMillimeters,
        voxelCubicCentimeters: voxelCubicMillimeters / 1000,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rowSpacingMillimeters: 0.5,
    columnSpacingMillimeters: 0.5,
    sliceSpacingMillimeters: 2,
  },
  output: { voxelCubicMillimeters: 0.5, voxelCubicCentimeters: 0.0005 },
} satisfies ToolExample<Input, Output>;
export const imagingVoxelCubicUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["radiology", "health and medicine"],
      keywords: ["radiology", "health and medicine"],
    },
    id: "radiology/imaging-voxel-cubic-unit",
    title: "Imaging Voxel Cubic Unit",
    description:
      "Compute a rectangular voxel volume from explicit positive axis spacings without segmenting an image or measuring a lesion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowSpacingMillimeters: { type: "number", exclusiveMinimum: 0 },
        columnSpacingMillimeters: { type: "number", exclusiveMinimum: 0 },
        sliceSpacingMillimeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "rowSpacingMillimeters",
        "columnSpacingMillimeters",
        "sliceSpacingMillimeters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voxelCubicMillimeters: { type: "number" },
        voxelCubicCentimeters: { type: "number" },
      },
      required: ["voxelCubicMillimeters", "voxelCubicCentimeters"],
    },
    ports: {
      inputs: [
        {
          id: "rowSpacingMillimeters",
          label: "Row Spacing Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columnSpacingMillimeters",
          label: "Column Spacing Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sliceSpacingMillimeters",
          label: "Slice Spacing Millimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voxelCubicMillimeters",
          label: "Voxel Cubic Millimeters",
          valueType: { type: "number" },
        },
        {
          id: "voxelCubicCentimeters",
          label: "Voxel Cubic Centimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = imagingVoxelCubicUnitTool.execute;
export default imagingVoxelCubicUnitTool;
