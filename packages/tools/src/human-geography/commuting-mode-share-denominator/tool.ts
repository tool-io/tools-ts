import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modeCount: number;
  readonly knownModeCount: number;
  readonly unknownModeCount: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly modeShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modeCount: { type: "integer", minimum: 0 },
    knownModeCount: { type: "integer", minimum: 0 },
    unknownModeCount: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: [
    "modeCount",
    "knownModeCount",
    "unknownModeCount",
    "includeUnknown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    modeShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "modeShare", "defined"],
} as const;
/** Calculate an explicit commute-mode share under a caller-selected unknown-response denominator policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modeCount, knownModeCount, unknownModeCount, includeUnknown } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(knownModeCount) &&
        knownModeCount >= 0 &&
        knownModeCount <= Number.MAX_SAFE_INTEGER,
      "knownModeCount",
    ),
      knownModeCount);
    (H.domain(
      Number.isSafeInteger(unknownModeCount) &&
        unknownModeCount >= 0 &&
        unknownModeCount <= Number.MAX_SAFE_INTEGER,
      "unknownModeCount",
    ),
      unknownModeCount);
    (H.domain(
      Number.isSafeInteger(modeCount) &&
        modeCount >= 0 &&
        modeCount <= knownModeCount,
      "modeCount",
    ),
      modeCount);
    return (() => {
      const denominator =
        knownModeCount + (includeUnknown ? unknownModeCount : 0);
      return {
        denominator,
        modeShare: denominator > 0 ? modeCount / denominator : 0,
        defined: denominator > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    modeCount: 30,
    knownModeCount: 100,
    unknownModeCount: 20,
    includeUnknown: true,
  },
  output: { denominator: 120, modeShare: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const commutingModeShareDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["human-geography", "human geography", "social sciences"],
      keywords: ["human geography", "social sciences"],
    },
    id: "human-geography/commuting-mode-share-denominator",
    title: "Commuting Mode Share Denominator",
    description:
      "Calculate an explicit commute-mode share under a caller-selected unknown-response denominator policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modeCount: { type: "integer", minimum: 0 },
        knownModeCount: { type: "integer", minimum: 0 },
        unknownModeCount: { type: "integer", minimum: 0 },
        includeUnknown: { type: "boolean" },
      },
      required: [
        "modeCount",
        "knownModeCount",
        "unknownModeCount",
        "includeUnknown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        modeShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "modeShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "modeCount",
          label: "Mode Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "knownModeCount",
          label: "Known Mode Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknownModeCount",
          label: "Unknown Mode Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnknown",
          label: "Include Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        { id: "modeShare", label: "Mode Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = commutingModeShareDenominatorTool.execute;
export default commutingModeShareDenominatorTool;
