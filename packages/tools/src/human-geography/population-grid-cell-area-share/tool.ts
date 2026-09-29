import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellArea: number;
  readonly studyArea: number;
  readonly excludedCellArea: number;
};
export type Output = {
  readonly eligibleCellArea: number;
  readonly areaShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellArea: { type: "number", minimum: 0 },
    studyArea: { type: "number", exclusiveMinimum: 0 },
    excludedCellArea: { type: "number", minimum: 0 },
  },
  required: ["cellArea", "studyArea", "excludedCellArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCellArea: { type: "number" },
    areaShare: { type: "number" },
  },
  required: ["eligibleCellArea", "areaShare"],
} as const;
/** Supplied spatial area allocation only; no population density or within-cell distribution is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellArea, studyArea, excludedCellArea } = request;
  const compute = (): Output => {
    H.positive(studyArea);
    H.domain(
      cellArea >= 0 &&
        cellArea <= studyArea &&
        excludedCellArea >= 0 &&
        excludedCellArea <= cellArea,
    );
    return {
      eligibleCellArea: cellArea - excludedCellArea,
      areaShare: (cellArea - excludedCellArea) / studyArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellArea: 20, studyArea: 100, excludedCellArea: 5 },
  output: { eligibleCellArea: 15, areaShare: 0.15 },
} satisfies ToolExample<Input, Output>;
export const populationGridCellAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/population-grid-cell-area-share",
    title: "Population Grid Cell Area Share Tool",
    description:
      "Supplied spatial area allocation only; no population density or within-cell distribution is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellArea: { type: "number", minimum: 0 },
        studyArea: { type: "number", exclusiveMinimum: 0 },
        excludedCellArea: { type: "number", minimum: 0 },
      },
      required: ["cellArea", "studyArea", "excludedCellArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCellArea: { type: "number" },
        areaShare: { type: "number" },
      },
      required: ["eligibleCellArea", "areaShare"],
    },
    ports: {
      inputs: [
        {
          id: "cellArea",
          label: "Cell Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "studyArea",
          label: "Study Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedCellArea",
          label: "Excluded Cell Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleCellArea",
          label: "Eligible Cell Area",
          valueType: { type: "number" },
        },
        { id: "areaShare", label: "Area Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = populationGridCellAreaShareTool.execute;
export default populationGridCellAreaShareTool;
