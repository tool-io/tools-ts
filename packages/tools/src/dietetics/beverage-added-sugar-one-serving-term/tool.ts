import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentrationPer100: number;
  readonly servingVolume: number;
  readonly addedFraction: number;
};
export type Output = {
  readonly totalSugar: number;
  readonly addedSugar: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentrationPer100: { type: "number", minimum: 0 },
    servingVolume: { type: "number", minimum: 0 },
    addedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["concentrationPer100", "servingVolume", "addedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSugar: { type: "number" },
    addedSugar: { type: "number" },
  },
  required: ["totalSugar", "addedSugar"],
} as const;
/** Calculate beverage added sugar one serving term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentrationPer100, servingVolume, addedFraction } = request;
  const compute = (): Output => {
    H.domain(concentrationPer100 >= 0 && servingVolume >= 0);
    H.probability(addedFraction);
    return {
      totalSugar: (concentrationPer100 * servingVolume) / 100,
      addedSugar: (concentrationPer100 * servingVolume * addedFraction) / 100,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentrationPer100: 10, servingVolume: 250, addedFraction: 0.8 },
  output: { totalSugar: 25, addedSugar: 20 },
} satisfies ToolExample<Input, Output>;
export const beverageAddedSugarOneServingTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/beverage-added-sugar-one-serving-term",
    title: "Beverage Added Sugar One Serving Term Tool",
    description:
      "Calculate beverage added sugar one serving term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentrationPer100: { type: "number", minimum: 0 },
        servingVolume: { type: "number", minimum: 0 },
        addedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["concentrationPer100", "servingVolume", "addedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSugar: { type: "number" },
        addedSugar: { type: "number" },
      },
      required: ["totalSugar", "addedSugar"],
    },
    ports: {
      inputs: [
        {
          id: "concentrationPer100",
          label: "Concentration Per100",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "servingVolume",
          label: "Serving Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedFraction",
          label: "Added Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalSugar",
          label: "Total Sugar",
          valueType: { type: "number" },
        },
        {
          id: "addedSugar",
          label: "Added Sugar",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = beverageAddedSugarOneServingTermTool.execute;
export default beverageAddedSugarOneServingTermTool;
