import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedMass: number;
  readonly feedSolidsFraction: number;
  readonly collectedMass: number;
  readonly powderSolidsFraction: number;
};
export type Output = {
  readonly feedSolids: number;
  readonly collectedSolids: number;
  readonly recovery: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedMass: { type: "number", exclusiveMinimum: 0 },
    feedSolidsFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    collectedMass: { type: "number", minimum: 0 },
    powderSolidsFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "feedMass",
    "feedSolidsFraction",
    "collectedMass",
    "powderSolidsFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedSolids: { type: "number" },
    collectedSolids: { type: "number" },
    recovery: { type: "number" },
  },
  required: ["feedSolids", "collectedSolids", "recovery"],
} as const;
/** Calculate spray drying feed solids balance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedMass, feedSolidsFraction, collectedMass, powderSolidsFraction } =
    request;
  const compute = (): Output => {
    H.positive(feedMass);
    H.domain(
      feedSolidsFraction > 0 && feedSolidsFraction <= 1 && collectedMass >= 0,
    );
    H.probability(powderSolidsFraction);
    return {
      feedSolids: feedMass * feedSolidsFraction,
      collectedSolids: collectedMass * powderSolidsFraction,
      recovery:
        (collectedMass * powderSolidsFraction) /
        (feedMass * feedSolidsFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedMass: 100,
    feedSolidsFraction: 0.2,
    collectedMass: 20,
    powderSolidsFraction: 0.9,
  },
  output: { feedSolids: 20, collectedSolids: 18, recovery: 0.9 },
} satisfies ToolExample<Input, Output>;
export const sprayDryingFeedSolidsBalanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/spray-drying-feed-solids-balance-term",
    title: "Spray Drying Feed Solids Balance Term Tool",
    description:
      "Calculate spray drying feed solids balance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedMass: { type: "number", exclusiveMinimum: 0 },
        feedSolidsFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        collectedMass: { type: "number", minimum: 0 },
        powderSolidsFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "feedMass",
        "feedSolidsFraction",
        "collectedMass",
        "powderSolidsFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedSolids: { type: "number" },
        collectedSolids: { type: "number" },
        recovery: { type: "number" },
      },
      required: ["feedSolids", "collectedSolids", "recovery"],
    },
    ports: {
      inputs: [
        {
          id: "feedMass",
          label: "Feed Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feedSolidsFraction",
          label: "Feed Solids Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "collectedMass",
          label: "Collected Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "powderSolidsFraction",
          label: "Powder Solids Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "feedSolids",
          label: "Feed Solids",
          valueType: { type: "number" },
        },
        {
          id: "collectedSolids",
          label: "Collected Solids",
          valueType: { type: "number" },
        },
        { id: "recovery", label: "Recovery", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sprayDryingFeedSolidsBalanceTermTool.execute;
export default sprayDryingFeedSolidsBalanceTermTool;
