import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heightAboveStation: number;
  readonly stationAboveDatum: number;
  readonly referenceCorrection: number;
};
export type Output = { readonly heightAboveDatum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightAboveStation: { type: "number" },
    stationAboveDatum: { type: "number" },
    referenceCorrection: { type: "number" },
  },
  required: ["heightAboveStation", "stationAboveDatum", "referenceCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heightAboveDatum: { type: "number" } },
  required: ["heightAboveDatum"],
} as const;
/** Bridge explicitly supplied vertical datum offsets without estimating a geoid or atmospheric height model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heightAboveStation, stationAboveDatum, referenceCorrection } =
    request;
  const compute = (): Output => {
    return {
      heightAboveDatum:
        heightAboveStation + stationAboveDatum + referenceCorrection,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    heightAboveStation: 1000,
    stationAboveDatum: 200,
    referenceCorrection: -5,
  },
  output: { heightAboveDatum: 1195 },
} satisfies ToolExample<Input, Output>;
export const radiosondeHeightDatumBridgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/radiosonde-height-datum-bridge",
    title: "Radiosonde Height Datum Bridge Tool",
    description:
      "Bridge explicitly supplied vertical datum offsets without estimating a geoid or atmospheric height model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heightAboveStation: { type: "number" },
        stationAboveDatum: { type: "number" },
        referenceCorrection: { type: "number" },
      },
      required: [
        "heightAboveStation",
        "stationAboveDatum",
        "referenceCorrection",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { heightAboveDatum: { type: "number" } },
      required: ["heightAboveDatum"],
    },
    ports: {
      inputs: [
        {
          id: "heightAboveStation",
          label: "Height Above Station",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stationAboveDatum",
          label: "Station Above Datum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCorrection",
          label: "Reference Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightAboveDatum",
          label: "Height Above Datum",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radiosondeHeightDatumBridgeTool.execute;
export default radiosondeHeightDatumBridgeTool;
