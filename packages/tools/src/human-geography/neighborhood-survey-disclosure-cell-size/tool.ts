import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cellWidth: number; readonly cellHeight: number };
export type Output = { readonly cellArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellWidth: { type: "number", minimum: 0 },
    cellHeight: { type: "number", minimum: 0 },
  },
  required: ["cellWidth", "cellHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cellArea: { type: "number" } },
  required: ["cellArea"],
} as const;
/** Calculate an explicit rectangular neighborhood survey disclosure-cell area without claiming anonymity or k-anonymity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellWidth, cellHeight } = request;
  const compute = (): Output => {
    H.domain(cellWidth >= 0, "cellWidth");
    H.domain(cellHeight >= 0, "cellHeight");
    return { cellArea: cellWidth * cellHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellWidth: 100, cellHeight: 200 },
  output: { cellArea: 20000 },
} satisfies ToolExample<Input, Output>;
export const neighborhoodSurveyDisclosureCellSizeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "human-geography/neighborhood-survey-disclosure-cell-size",
      title: "Neighborhood Survey Disclosure Cell Size Tool",
      description:
        "Calculate an explicit rectangular neighborhood survey disclosure-cell area without claiming anonymity or k-anonymity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cellWidth: { type: "number", minimum: 0 },
          cellHeight: { type: "number", minimum: 0 },
        },
        required: ["cellWidth", "cellHeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { cellArea: { type: "number" } },
        required: ["cellArea"],
      },
      ports: {
        inputs: [
          {
            id: "cellWidth",
            label: "Cell Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cellHeight",
            label: "Cell Height",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "cellArea", label: "Cell Area", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = neighborhoodSurveyDisclosureCellSizeTool.execute;
export default neighborhoodSurveyDisclosureCellSizeTool;
