import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offeredMass: number;
  readonly refusedMass: number;
};
export type Output = {
  readonly refusalFraction: number;
  readonly consumedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offeredMass: { type: "number", exclusiveMinimum: 0 },
    refusedMass: { type: "number", minimum: 0 },
  },
  required: ["offeredMass", "refusedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    refusalFraction: { type: "number" },
    consumedMass: { type: "number" },
  },
  required: ["refusalFraction", "consumedMass"],
} as const;
/** Calculate measured ration refusal fraction and consumed mass on a consistent wet or dry mass basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offeredMass, refusedMass } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(offeredMass) && offeredMass > 0, "offeredMass"),
      offeredMass);
    H.domain(refusedMass >= 0 && refusedMass <= offeredMass, "refusedMass");
    return {
      refusalFraction: refusedMass / offeredMass,
      consumedMass: offeredMass - refusedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offeredMass: 20, refusedMass: 3 },
  output: { refusalFraction: 0.15, consumedMass: 17 },
} satisfies ToolExample<Input, Output>;
export const feedRationRefusalShareActualTool = H.defineSchemaCalculation<
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
    id: "animal-science/feed-ration-refusal-share-actual",
    title: "Feed Ration Refusal Share Actual",
    description:
      "Calculate measured ration refusal fraction and consumed mass on a consistent wet or dry mass basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offeredMass: { type: "number", exclusiveMinimum: 0 },
        refusedMass: { type: "number", minimum: 0 },
      },
      required: ["offeredMass", "refusedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        refusalFraction: { type: "number" },
        consumedMass: { type: "number" },
      },
      required: ["refusalFraction", "consumedMass"],
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
          id: "refusedMass",
          label: "Refused Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "refusalFraction",
          label: "Refusal Fraction",
          valueType: { type: "number" },
        },
        {
          id: "consumedMass",
          label: "Consumed Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedRationRefusalShareActualTool.execute;
export default feedRationRefusalShareActualTool;
