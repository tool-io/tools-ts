import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cuffFinishedLength: number;
  readonly overlapLength: number;
  readonly buttonSetback: number;
};
export type Output = { readonly buttonCoordinateFromStart: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cuffFinishedLength: { type: "number", minimum: 0 },
    overlapLength: { type: "number", minimum: 0 },
    buttonSetback: { type: "number", minimum: 0 },
  },
  required: ["cuffFinishedLength", "overlapLength", "buttonSetback"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { buttonCoordinateFromStart: { type: "number" } },
  required: ["buttonCoordinateFromStart"],
} as const;
/** Place an explicit cuff button coordinate inside a supplied end overlap under a stated start-axis convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cuffFinishedLength, overlapLength, buttonSetback } = request;
  const compute = (): Output => {
    H.domain(
      cuffFinishedLength >= 0 &&
        overlapLength >= 0 &&
        overlapLength <= cuffFinishedLength,
      "cuffFinishedLength",
    );
    H.domain(
      buttonSetback >= 0 && buttonSetback <= overlapLength,
      "buttonSetback",
    );
    return {
      buttonCoordinateFromStart:
        cuffFinishedLength - overlapLength + buttonSetback,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cuffFinishedLength: 240, overlapLength: 30, buttonSetback: 10 },
  output: { buttonCoordinateFromStart: 220 },
} satisfies ToolExample<Input, Output>;
export const cuffOverlapButtonPlacementDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["fashion", "arts and design"],
      keywords: ["fashion", "arts and design"],
    },
    id: "fashion/cuff-overlap-button-placement-distance",
    title: "Cuff Overlap Button Placement Distance",
    description:
      "Place an explicit cuff button coordinate inside a supplied end overlap under a stated start-axis convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cuffFinishedLength: { type: "number", minimum: 0 },
        overlapLength: { type: "number", minimum: 0 },
        buttonSetback: { type: "number", minimum: 0 },
      },
      required: ["cuffFinishedLength", "overlapLength", "buttonSetback"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { buttonCoordinateFromStart: { type: "number" } },
      required: ["buttonCoordinateFromStart"],
    },
    ports: {
      inputs: [
        {
          id: "cuffFinishedLength",
          label: "Cuff Finished Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapLength",
          label: "Overlap Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "buttonSetback",
          label: "Button Setback",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "buttonCoordinateFromStart",
          label: "Button Coordinate From Start",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cuffOverlapButtonPlacementDistanceTool.execute;
export default cuffOverlapButtonPlacementDistanceTool;
