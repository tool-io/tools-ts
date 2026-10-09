import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alreadyPaired: boolean;
  readonly firstStrictlyPrefers: boolean;
  readonly secondStrictlyPrefers: boolean;
};
export type Output = { readonly blockingPair: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alreadyPaired: { type: "boolean" },
    firstStrictlyPrefers: { type: "boolean" },
    secondStrictlyPrefers: { type: "boolean" },
  },
  required: ["alreadyPaired", "firstStrictlyPrefers", "secondStrictlyPrefers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { blockingPair: { type: "boolean" } },
  required: ["blockingPair"],
} as const;
/** Flag one unpaired candidate whose two explicit strict-preference flags are true, without searching a matching or inferring preferences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alreadyPaired, firstStrictlyPrefers, secondStrictlyPrefers } =
    request;
  const compute = (): Output => {
    return {
      blockingPair:
        !alreadyPaired && firstStrictlyPrefers && secondStrictlyPrefers,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    alreadyPaired: false,
    firstStrictlyPrefers: true,
    secondStrictlyPrefers: true,
  },
  output: { blockingPair: true },
} satisfies ToolExample<Input, Output>;
export const matchingGameBlockingPairFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/matching-game-blocking-pair-flag",
    title: "Matching Game Blocking Pair Flag Tool",
    description:
      "Flag one unpaired candidate whose two explicit strict-preference flags are true, without searching a matching or inferring preferences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alreadyPaired: { type: "boolean" },
        firstStrictlyPrefers: { type: "boolean" },
        secondStrictlyPrefers: { type: "boolean" },
      },
      required: [
        "alreadyPaired",
        "firstStrictlyPrefers",
        "secondStrictlyPrefers",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { blockingPair: { type: "boolean" } },
      required: ["blockingPair"],
    },
    ports: {
      inputs: [
        {
          id: "alreadyPaired",
          label: "Already Paired",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "firstStrictlyPrefers",
          label: "First Strictly Prefers",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondStrictlyPrefers",
          label: "Second Strictly Prefers",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "blockingPair",
          label: "Blocking Pair",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = matchingGameBlockingPairFlagTool.execute;
export default matchingGameBlockingPairFlagTool;
