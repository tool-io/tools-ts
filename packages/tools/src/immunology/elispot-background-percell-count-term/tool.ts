import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulatedSpots: number;
  readonly blankSpots: number;
  readonly stimulatedCells: number;
  readonly blankCells: number;
  readonly reportCellBase: number;
};
export type Output = {
  readonly scaledBackground: number;
  readonly correctedSpots: number;
  readonly perCellBase: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulatedSpots: { type: "integer", minimum: 0 },
    blankSpots: { type: "integer", minimum: 0 },
    stimulatedCells: { type: "integer", minimum: 1 },
    blankCells: { type: "integer", minimum: 1 },
    reportCellBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "stimulatedSpots",
    "blankSpots",
    "stimulatedCells",
    "blankCells",
    "reportCellBase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaledBackground: { type: "number" },
    correctedSpots: { type: "number" },
    perCellBase: { type: "number" },
  },
  required: ["scaledBackground", "correctedSpots", "perCellBase"],
} as const;
/** Matched cell-count background subtraction with signed corrected spots, without a positive-response cutoff. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    stimulatedSpots,
    blankSpots,
    stimulatedCells,
    blankCells,
    reportCellBase,
  } = request;
  const compute = (): Output => {
    H.integer(stimulatedSpots, 0);
    H.integer(blankSpots, 0);
    H.integer(stimulatedCells, 1);
    H.integer(blankCells, 1);
    H.positive(reportCellBase);
    return {
      scaledBackground: (blankSpots * stimulatedCells) / blankCells,
      correctedSpots:
        stimulatedSpots - (blankSpots * stimulatedCells) / blankCells,
      perCellBase:
        (stimulatedSpots * reportCellBase) / stimulatedCells -
        (blankSpots * reportCellBase) / blankCells,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stimulatedSpots: 100,
    blankSpots: 10,
    stimulatedCells: 200000,
    blankCells: 100000,
    reportCellBase: 1000000,
  },
  output: { scaledBackground: 20, correctedSpots: 80, perCellBase: 400 },
} satisfies ToolExample<Input, Output>;
export const elispotBackgroundPercellCountTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/elispot-background-percell-count-term",
    title: "Elispot Background Percell Count Term Tool",
    description:
      "Matched cell-count background subtraction with signed corrected spots, without a positive-response cutoff.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulatedSpots: { type: "integer", minimum: 0 },
        blankSpots: { type: "integer", minimum: 0 },
        stimulatedCells: { type: "integer", minimum: 1 },
        blankCells: { type: "integer", minimum: 1 },
        reportCellBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "stimulatedSpots",
        "blankSpots",
        "stimulatedCells",
        "blankCells",
        "reportCellBase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaledBackground: { type: "number" },
        correctedSpots: { type: "number" },
        perCellBase: { type: "number" },
      },
      required: ["scaledBackground", "correctedSpots", "perCellBase"],
    },
    ports: {
      inputs: [
        {
          id: "stimulatedSpots",
          label: "Stimulated Spots",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "blankSpots",
          label: "Blank Spots",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stimulatedCells",
          label: "Stimulated Cells",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "blankCells",
          label: "Blank Cells",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reportCellBase",
          label: "Report Cell Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledBackground",
          label: "Scaled Background",
          valueType: { type: "number" },
        },
        {
          id: "correctedSpots",
          label: "Corrected Spots",
          valueType: { type: "number" },
        },
        {
          id: "perCellBase",
          label: "Per Cell Base",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = elispotBackgroundPercellCountTermTool.execute;
export default elispotBackgroundPercellCountTermTool;
