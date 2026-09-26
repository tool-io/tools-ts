import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVolume: number;
  readonly secondVolume: number;
  readonly firstConcentration: number;
  readonly secondConcentration: number;
  readonly removalFraction: number;
};
export type Output = {
  readonly totalVolume: number;
  readonly preRemovalMass: number;
  readonly finalConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVolume: { type: "number", minimum: 0 },
    secondVolume: { type: "number", minimum: 0 },
    firstConcentration: { type: "number", minimum: 0 },
    secondConcentration: { type: "number", minimum: 0 },
    removalFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "firstVolume",
    "secondVolume",
    "firstConcentration",
    "secondConcentration",
    "removalFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number" },
    preRemovalMass: { type: "number" },
    finalConcentration: { type: "number" },
  },
  required: ["totalVolume", "preRemovalMass", "finalConcentration"],
} as const;
/** Calculate drinking water source blend one contaminant from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstVolume,
    secondVolume,
    firstConcentration,
    secondConcentration,
    removalFraction,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstVolume >= 0 &&
        secondVolume >= 0 &&
        firstVolume + secondVolume > 0 &&
        firstConcentration >= 0 &&
        secondConcentration >= 0,
    );
    H.probability(removalFraction);
    return {
      totalVolume: firstVolume + secondVolume,
      preRemovalMass:
        firstVolume * firstConcentration + secondVolume * secondConcentration,
      finalConcentration:
        ((firstVolume * firstConcentration +
          secondVolume * secondConcentration) *
          (1 - removalFraction)) /
        (firstVolume + secondVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstVolume: 100,
    secondVolume: 300,
    firstConcentration: 10,
    secondConcentration: 2,
    removalFraction: 0.2,
  },
  output: { totalVolume: 400, preRemovalMass: 1600, finalConcentration: 3.2 },
} satisfies ToolExample<Input, Output>;
export const drinkingWaterSourceBlendOneContaminantTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-health/drinking-water-source-blend-one-contaminant",
      title: "Drinking Water Source Blend One Contaminant Tool",
      description:
        "Calculate drinking water source blend one contaminant from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstVolume: { type: "number", minimum: 0 },
          secondVolume: { type: "number", minimum: 0 },
          firstConcentration: { type: "number", minimum: 0 },
          secondConcentration: { type: "number", minimum: 0 },
          removalFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "firstVolume",
          "secondVolume",
          "firstConcentration",
          "secondConcentration",
          "removalFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalVolume: { type: "number" },
          preRemovalMass: { type: "number" },
          finalConcentration: { type: "number" },
        },
        required: ["totalVolume", "preRemovalMass", "finalConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "firstVolume",
            label: "First Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondVolume",
            label: "Second Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstConcentration",
            label: "First Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondConcentration",
            label: "Second Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "removalFraction",
            label: "Removal Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalVolume",
            label: "Total Volume",
            valueType: { type: "number" },
          },
          {
            id: "preRemovalMass",
            label: "Pre Removal Mass",
            valueType: { type: "number" },
          },
          {
            id: "finalConcentration",
            label: "Final Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = drinkingWaterSourceBlendOneContaminantTool.execute;
export default drinkingWaterSourceBlendOneContaminantTool;
