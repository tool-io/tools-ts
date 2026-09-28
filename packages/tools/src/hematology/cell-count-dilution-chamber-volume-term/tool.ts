import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly dilution: number;
  readonly areaMm2: number;
  readonly depthMm: number;
};
export type Output = {
  readonly countedVolumeMicroliters: number;
  readonly cellsPerMicroliter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    dilution: { type: "number", exclusiveMinimum: 0 },
    areaMm2: { type: "number", exclusiveMinimum: 0 },
    depthMm: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["count", "dilution", "areaMm2", "depthMm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedVolumeMicroliters: { type: "number" },
    cellsPerMicroliter: { type: "number" },
  },
  required: ["countedVolumeMicroliters", "cellsPerMicroliter"],
} as const;
/** Counting-chamber geometry with one cubic millimeter equal to one microliter; dilution and counted area are explicitly supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, dilution, areaMm2, depthMm } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.positive(dilution);
    H.positive(areaMm2);
    H.positive(depthMm);
    return {
      countedVolumeMicroliters: areaMm2 * depthMm,
      cellsPerMicroliter: (count * dilution) / (areaMm2 * depthMm),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 100, dilution: 20, areaMm2: 4, depthMm: 0.1 },
  output: { countedVolumeMicroliters: 0.4, cellsPerMicroliter: 5000 },
} satisfies ToolExample<Input, Output>;
export const cellCountDilutionChamberVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/cell-count-dilution-chamber-volume-term",
    title: "Cell Count Dilution Chamber Volume Term Tool",
    description:
      "Counting-chamber geometry with one cubic millimeter equal to one microliter; dilution and counted area are explicitly supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        dilution: { type: "number", exclusiveMinimum: 0 },
        areaMm2: { type: "number", exclusiveMinimum: 0 },
        depthMm: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["count", "dilution", "areaMm2", "depthMm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedVolumeMicroliters: { type: "number" },
        cellsPerMicroliter: { type: "number" },
      },
      required: ["countedVolumeMicroliters", "cellsPerMicroliter"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dilution",
          label: "Dilution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaMm2",
          label: "Area Mm2",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depthMm",
          label: "Depth Mm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countedVolumeMicroliters",
          label: "Counted Volume Microliters",
          valueType: { type: "number" },
        },
        {
          id: "cellsPerMicroliter",
          label: "Cells Per Microliter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cellCountDilutionChamberVolumeTermTool.execute;
export default cellCountDilutionChamberVolumeTermTool;
