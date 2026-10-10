import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freezingLevelHeight: number;
  readonly stationHeight: number;
};
export type Output = { readonly heightAboveStation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freezingLevelHeight: { type: "number" },
    stationHeight: { type: "number" },
  },
  required: ["freezingLevelHeight", "stationHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heightAboveStation: { type: "number" } },
  required: ["heightAboveStation"],
} as const;
/** Subtract explicit station height from freezing-level height using a shared vertical datum without predicting precipitation phase. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { freezingLevelHeight, stationHeight } = request;
  const compute = (): Output => {
    return { heightAboveStation: freezingLevelHeight - stationHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { freezingLevelHeight: 2000, stationHeight: 1200 },
  output: { heightAboveStation: 800 },
} satisfies ToolExample<Input, Output>;
export const freezingLevelStationHeightGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/freezing-level-station-height-gap",
    title: "Freezing Level Station Height Gap Tool",
    description:
      "Subtract explicit station height from freezing-level height using a shared vertical datum without predicting precipitation phase.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freezingLevelHeight: { type: "number" },
        stationHeight: { type: "number" },
      },
      required: ["freezingLevelHeight", "stationHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { heightAboveStation: { type: "number" } },
      required: ["heightAboveStation"],
    },
    ports: {
      inputs: [
        {
          id: "freezingLevelHeight",
          label: "Freezing Level Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stationHeight",
          label: "Station Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightAboveStation",
          label: "Height Above Station",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = freezingLevelStationHeightGapTool.execute;
export default freezingLevelStationHeightGapTool;
