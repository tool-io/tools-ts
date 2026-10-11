import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seedlingsBefore: number;
  readonly seedlingsAfter: number;
};
export type Output = {
  readonly lostSeedlings: number;
  readonly lossFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seedlingsBefore: { type: "integer", minimum: 1 },
    seedlingsAfter: { type: "integer", minimum: 0 },
  },
  required: ["seedlingsBefore", "seedlingsAfter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostSeedlings: { type: "integer" },
    lossFraction: { type: "number" },
  },
  required: ["lostSeedlings", "lossFraction"],
} as const;
/** Compare explicit seedling counts before and after a transfer without attributing causes of loss. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seedlingsBefore, seedlingsAfter } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(seedlingsBefore) &&
        seedlingsBefore >= 1 &&
        seedlingsBefore <= Number.MAX_SAFE_INTEGER,
      "seedlingsBefore",
    ),
      seedlingsBefore);
    (H.domain(
      Number.isSafeInteger(seedlingsAfter) &&
        seedlingsAfter >= 0 &&
        seedlingsAfter <= seedlingsBefore,
      "seedlingsAfter",
    ),
      seedlingsAfter);
    return {
      lostSeedlings: seedlingsBefore - seedlingsAfter,
      lossFraction: (seedlingsBefore - seedlingsAfter) / seedlingsBefore,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seedlingsBefore: 100, seedlingsAfter: 95 },
  output: { lostSeedlings: 5, lossFraction: 0.05 },
} satisfies ToolExample<Input, Output>;
export const growTraySeedlingTransferLossTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["vertical-farming", "vertical farming", "agriculture"],
      keywords: ["vertical farming", "agriculture"],
    },
    id: "vertical-farming/grow-tray-seedling-transfer-loss",
    title: "Grow Tray Seedling Transfer Loss",
    description:
      "Compare explicit seedling counts before and after a transfer without attributing causes of loss.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seedlingsBefore: { type: "integer", minimum: 1 },
        seedlingsAfter: { type: "integer", minimum: 0 },
      },
      required: ["seedlingsBefore", "seedlingsAfter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lostSeedlings: { type: "integer" },
        lossFraction: { type: "number" },
      },
      required: ["lostSeedlings", "lossFraction"],
    },
    ports: {
      inputs: [
        {
          id: "seedlingsBefore",
          label: "Seedlings Before",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "seedlingsAfter",
          label: "Seedlings After",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lostSeedlings",
          label: "Lost Seedlings",
          valueType: { type: "integer" },
        },
        {
          id: "lossFraction",
          label: "Loss Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = growTraySeedlingTransferLossTool.execute;
export default growTraySeedlingTransferLossTool;
