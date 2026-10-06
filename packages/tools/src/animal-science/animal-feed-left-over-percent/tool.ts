import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offeredMass: number;
  readonly leftoverMass: number;
};
export type Output = {
  readonly leftoverPercent: number;
  readonly removedFromOfferMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offeredMass: { type: "number", exclusiveMinimum: 0 },
    leftoverMass: { type: "number", minimum: 0 },
  },
  required: ["offeredMass", "leftoverMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftoverPercent: { type: "number" },
    removedFromOfferMass: { type: "number" },
  },
  required: ["leftoverPercent", "removedFromOfferMass"],
} as const;
/** Describe leftover feed as a percentage of offered feed without equating the difference with consumed feed when spillage is unmeasured. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offeredMass, leftoverMass } = request;
  const compute = (): Output => {
    (H.domain(offeredMass > 0, "offeredMass"), offeredMass);
    H.domain(leftoverMass >= 0 && leftoverMass <= offeredMass, "leftoverMass");
    return {
      leftoverPercent: (100 * leftoverMass) / offeredMass,
      removedFromOfferMass: offeredMass - leftoverMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offeredMass: 25, leftoverMass: 5 },
  output: { leftoverPercent: 20, removedFromOfferMass: 20 },
} satisfies ToolExample<Input, Output>;
export const animalFeedLeftOverPercentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/animal-feed-left-over-percent",
    title: "Animal Feed Left Over Percent",
    description:
      "Describe leftover feed as a percentage of offered feed without equating the difference with consumed feed when spillage is unmeasured.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offeredMass: { type: "number", exclusiveMinimum: 0 },
        leftoverMass: { type: "number", minimum: 0 },
      },
      required: ["offeredMass", "leftoverMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftoverPercent: { type: "number" },
        removedFromOfferMass: { type: "number" },
      },
      required: ["leftoverPercent", "removedFromOfferMass"],
    },
    ports: {
      inputs: [
        {
          id: "offeredMass",
          label: "Offered Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftoverMass",
          label: "Leftover Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leftoverPercent",
          label: "Leftover Percent",
          valueType: { type: "number" },
        },
        {
          id: "removedFromOfferMass",
          label: "Removed From Offer Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalFeedLeftOverPercentTool.execute;
export default animalFeedLeftOverPercentTool;
