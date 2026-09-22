import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedFeed: number;
  readonly plantedArea: number;
  readonly observedDays: number;
};
export type Output = { readonly feedPerAreaDay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedFeed: { type: "number", minimum: 0 },
    plantedArea: { type: "number", exclusiveMinimum: 0 },
    observedDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedFeed", "plantedArea", "observedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { feedPerAreaDay: { type: "number" } },
  required: ["feedPerAreaDay"],
} as const;
/** Observed feed-effort ratio without selecting feeding or planting rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedFeed, plantedArea, observedDays } = request;
  const compute = (): Output => {
    H.domain(observedFeed >= 0);
    H.positive(plantedArea);
    H.positive(observedDays);
    return { feedPerAreaDay: observedFeed / (plantedArea * observedDays) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedFeed: 100, plantedArea: 10, observedDays: 5 },
  output: { feedPerAreaDay: 2 },
} satisfies ToolExample<Input, Output>;
export const aquaponicFishFeedPlantAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/aquaponic-fish-feed-plant-area-ratio",
    title: "Aquaponic Fish Feed Plant Area Ratio Tool",
    description:
      "Observed feed-effort ratio without selecting feeding or planting rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedFeed: { type: "number", minimum: 0 },
        plantedArea: { type: "number", exclusiveMinimum: 0 },
        observedDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedFeed", "plantedArea", "observedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { feedPerAreaDay: { type: "number" } },
      required: ["feedPerAreaDay"],
    },
    ports: {
      inputs: [
        {
          id: "observedFeed",
          label: "Observed Feed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plantedArea",
          label: "Planted Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedDays",
          label: "Observed Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "feedPerAreaDay",
          label: "Feed Per Area Day",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicFishFeedPlantAreaRatioTool.execute;
export default aquaponicFishFeedPlantAreaRatioTool;
