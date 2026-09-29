import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredLevel: number;
  readonly datumOffset: number;
  readonly referenceLevel: number;
  readonly areaPerHeight: number;
};
export type Output = {
  readonly datumLevel: number;
  readonly levelGap: number;
  readonly equivalentVolumeGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLevel: { type: "number" },
    datumOffset: { type: "number" },
    referenceLevel: { type: "number" },
    areaPerHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredLevel", "datumOffset", "referenceLevel", "areaPerHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    datumLevel: { type: "number" },
    levelGap: { type: "number" },
    equivalentVolumeGap: { type: "number" },
  },
  required: ["datumLevel", "levelGap", "equivalentVolumeGap"],
} as const;
/** Calculate reservoir level reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredLevel, datumOffset, referenceLevel, areaPerHeight } = request;
  const compute = (): Output => {
    H.positive(areaPerHeight);
    return (() => {
      const datumLevel = measuredLevel + datumOffset,
        levelGap = datumLevel - referenceLevel;
      return {
        datumLevel,
        levelGap,
        equivalentVolumeGap: levelGap * areaPerHeight,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredLevel: 5,
    datumOffset: 1,
    referenceLevel: 4,
    areaPerHeight: 2,
  },
  output: { datumLevel: 6, levelGap: 2, equivalentVolumeGap: 4 },
} satisfies ToolExample<Input, Output>;
export const reservoirLevelReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/reservoir-level-reference-gap",
    title: "Reservoir Level Reference Gap Tool",
    description:
      "Calculate reservoir level reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredLevel: { type: "number" },
        datumOffset: { type: "number" },
        referenceLevel: { type: "number" },
        areaPerHeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "measuredLevel",
        "datumOffset",
        "referenceLevel",
        "areaPerHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        datumLevel: { type: "number" },
        levelGap: { type: "number" },
        equivalentVolumeGap: { type: "number" },
      },
      required: ["datumLevel", "levelGap", "equivalentVolumeGap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredLevel",
          label: "Measured Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "datumOffset",
          label: "Datum Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLevel",
          label: "Reference Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaPerHeight",
          label: "Area Per Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "datumLevel",
          label: "Datum Level",
          valueType: { type: "number" },
        },
        { id: "levelGap", label: "Level Gap", valueType: { type: "number" } },
        {
          id: "equivalentVolumeGap",
          label: "Equivalent Volume Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reservoirLevelReferenceGapTool.execute;
export default reservoirLevelReferenceGapTool;
