import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offeredWet: number;
  readonly offeredDryFraction: number;
  readonly refusedWet: number;
  readonly refusedDryFraction: number;
};
export type Output = {
  readonly offeredDry: number;
  readonly refusedDry: number;
  readonly consumedDry: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offeredWet: { type: "number", minimum: 0 },
    offeredDryFraction: { type: "number", minimum: 0, maximum: 1 },
    refusedWet: { type: "number", minimum: 0 },
    refusedDryFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "offeredWet",
    "offeredDryFraction",
    "refusedWet",
    "refusedDryFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offeredDry: { type: "number" },
    refusedDry: { type: "number" },
    consumedDry: { type: "number" },
  },
  required: ["offeredDry", "refusedDry", "consumedDry"],
} as const;
/** Signed feed dry-mass balance from independently supplied offered/refused moisture bases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offeredWet, offeredDryFraction, refusedWet, refusedDryFraction } =
    request;
  const compute = (): Output => {
    H.domain(offeredWet >= 0 && refusedWet >= 0);
    H.probability(offeredDryFraction);
    H.probability(refusedDryFraction);
    return {
      offeredDry: offeredWet * offeredDryFraction,
      refusedDry: refusedWet * refusedDryFraction,
      consumedDry:
        offeredWet * offeredDryFraction - refusedWet * refusedDryFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    offeredWet: 100,
    offeredDryFraction: 0.5,
    refusedWet: 20,
    refusedDryFraction: 0.6,
  },
  output: { offeredDry: 50, refusedDry: 12, consumedDry: 38 },
} satisfies ToolExample<Input, Output>;
export const feedRefusalDryBasisTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/feed-refusal-dry-basis-term",
    title: "Feed Refusal Dry Basis Term Tool",
    description:
      "Signed feed dry-mass balance from independently supplied offered/refused moisture bases.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offeredWet: { type: "number", minimum: 0 },
        offeredDryFraction: { type: "number", minimum: 0, maximum: 1 },
        refusedWet: { type: "number", minimum: 0 },
        refusedDryFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "offeredWet",
        "offeredDryFraction",
        "refusedWet",
        "refusedDryFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offeredDry: { type: "number" },
        refusedDry: { type: "number" },
        consumedDry: { type: "number" },
      },
      required: ["offeredDry", "refusedDry", "consumedDry"],
    },
    ports: {
      inputs: [
        {
          id: "offeredWet",
          label: "Offered Wet",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offeredDryFraction",
          label: "Offered Dry Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "refusedWet",
          label: "Refused Wet",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refusedDryFraction",
          label: "Refused Dry Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "offeredDry",
          label: "Offered Dry",
          valueType: { type: "number" },
        },
        {
          id: "refusedDry",
          label: "Refused Dry",
          valueType: { type: "number" },
        },
        {
          id: "consumedDry",
          label: "Consumed Dry",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedRefusalDryBasisTermTool.execute;
export default feedRefusalDryBasisTermTool;
