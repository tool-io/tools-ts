import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upperElevation: number;
  readonly lowerElevation: number;
  readonly upperDatumOffset: number;
  readonly lowerDatumOffset: number;
};
export type Output = {
  readonly correctedUpper: number;
  readonly correctedLower: number;
  readonly riserHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upperElevation: { type: "number" },
    lowerElevation: { type: "number" },
    upperDatumOffset: { type: "number" },
    lowerDatumOffset: { type: "number" },
  },
  required: [
    "upperElevation",
    "lowerElevation",
    "upperDatumOffset",
    "lowerDatumOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedUpper: { type: "number" },
    correctedLower: { type: "number" },
    riserHeight: { type: "number" },
  },
  required: ["correctedUpper", "correctedLower", "riserHeight"],
} as const;
/** Offsets are added to place both elevations on a common vertical datum; negative riser values remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upperElevation, lowerElevation, upperDatumOffset, lowerDatumOffset } =
    request;
  const compute = (): Output => {
    return {
      correctedUpper: upperElevation + upperDatumOffset,
      correctedLower: lowerElevation + lowerDatumOffset,
      riserHeight:
        upperElevation + upperDatumOffset - lowerElevation - lowerDatumOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    upperElevation: 150,
    lowerElevation: 130,
    upperDatumOffset: 2,
    lowerDatumOffset: -1,
  },
  output: { correctedUpper: 152, correctedLower: 129, riserHeight: 23 },
} satisfies ToolExample<Input, Output>;
export const terraceRiserHeightDatumGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/terrace-riser-height-datum-gap",
    title: "Terrace Riser Height Datum Gap Tool",
    description:
      "Offsets are added to place both elevations on a common vertical datum; negative riser values remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upperElevation: { type: "number" },
        lowerElevation: { type: "number" },
        upperDatumOffset: { type: "number" },
        lowerDatumOffset: { type: "number" },
      },
      required: [
        "upperElevation",
        "lowerElevation",
        "upperDatumOffset",
        "lowerDatumOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedUpper: { type: "number" },
        correctedLower: { type: "number" },
        riserHeight: { type: "number" },
      },
      required: ["correctedUpper", "correctedLower", "riserHeight"],
    },
    ports: {
      inputs: [
        {
          id: "upperElevation",
          label: "Upper Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerElevation",
          label: "Lower Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperDatumOffset",
          label: "Upper Datum Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerDatumOffset",
          label: "Lower Datum Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedUpper",
          label: "Corrected Upper",
          valueType: { type: "number" },
        },
        {
          id: "correctedLower",
          label: "Corrected Lower",
          valueType: { type: "number" },
        },
        {
          id: "riserHeight",
          label: "Riser Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = terraceRiserHeightDatumGapTool.execute;
export default terraceRiserHeightDatumGapTool;
