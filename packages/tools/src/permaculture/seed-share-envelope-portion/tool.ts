import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalSeeds: number;
  readonly envelopeCount: number;
};
export type Output = {
  readonly seedsPerEnvelope: number;
  readonly remainderSeeds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSeeds: { type: "integer", minimum: 0 },
    envelopeCount: { type: "integer", minimum: 1 },
  },
  required: ["totalSeeds", "envelopeCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seedsPerEnvelope: { type: "integer" },
    remainderSeeds: { type: "integer" },
  },
  required: ["seedsPerEnvelope", "remainderSeeds"],
} as const;
/** Split an explicit seed count into equal whole-seed envelope portions and an undistributed remainder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalSeeds, envelopeCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalSeeds) &&
        totalSeeds >= 0 &&
        totalSeeds <= Number.MAX_SAFE_INTEGER,
      "totalSeeds",
    ),
      totalSeeds);
    (H.domain(
      Number.isSafeInteger(envelopeCount) &&
        envelopeCount >= 1 &&
        envelopeCount <= Number.MAX_SAFE_INTEGER,
      "envelopeCount",
    ),
      envelopeCount);
    return {
      seedsPerEnvelope: Math.floor(totalSeeds / envelopeCount),
      remainderSeeds: totalSeeds % envelopeCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalSeeds: 103, envelopeCount: 10 },
  output: { seedsPerEnvelope: 10, remainderSeeds: 3 },
} satisfies ToolExample<Input, Output>;
export const seedShareEnvelopePortionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["permaculture", "agriculture"],
      keywords: ["permaculture", "agriculture"],
    },
    id: "permaculture/seed-share-envelope-portion",
    title: "Seed Share Envelope Portion",
    description:
      "Split an explicit seed count into equal whole-seed envelope portions and an undistributed remainder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSeeds: { type: "integer", minimum: 0 },
        envelopeCount: { type: "integer", minimum: 1 },
      },
      required: ["totalSeeds", "envelopeCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seedsPerEnvelope: { type: "integer" },
        remainderSeeds: { type: "integer" },
      },
      required: ["seedsPerEnvelope", "remainderSeeds"],
    },
    ports: {
      inputs: [
        {
          id: "totalSeeds",
          label: "Total Seeds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "envelopeCount",
          label: "Envelope Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "seedsPerEnvelope",
          label: "Seeds Per Envelope",
          valueType: { type: "integer" },
        },
        {
          id: "remainderSeeds",
          label: "Remainder Seeds",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedShareEnvelopePortionTool.execute;
export default seedShareEnvelopePortionTool;
