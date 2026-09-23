import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOnly: number;
  readonly secondOnly: number;
  readonly continuityCorrection: number;
};
export type Output = {
  readonly difference: number;
  readonly correctedAbsoluteDifference: number;
  readonly statistic: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOnly: { type: "integer", minimum: 0 },
    secondOnly: { type: "integer", minimum: 0 },
    continuityCorrection: { type: "number", minimum: 0 },
  },
  required: ["firstOnly", "secondOnly", "continuityCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    correctedAbsoluteDifference: { type: "number" },
    statistic: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "difference",
    "correctedAbsoluteDifference",
    "statistic",
    "defined",
  ],
} as const;
/** Compute an explicitly continuity-corrected paired-discordance contribution without a p-value or significance rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOnly, secondOnly, continuityCorrection } = request;
  const compute = (): Output => {
    H.integer(firstOnly, 0);
    H.integer(secondOnly, 0);
    H.domain(continuityCorrection >= 0);
    return {
      difference: firstOnly - secondOnly,
      correctedAbsoluteDifference: Math.max(
        0,
        Math.abs(firstOnly - secondOnly) - continuityCorrection,
      ),
      statistic:
        firstOnly + secondOnly > 0
          ? Math.max(
              0,
              Math.abs(firstOnly - secondOnly) - continuityCorrection,
            ) **
              2 /
            (firstOnly + secondOnly)
          : 0,
      defined: firstOnly + secondOnly > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOnly: 8, secondOnly: 2, continuityCorrection: 1 },
  output: {
    difference: 6,
    correctedAbsoluteDifference: 5,
    statistic: 2.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const pairedBinaryDiscordanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/paired-binary-discordance-term",
    title: "Paired Binary Discordance Term Tool",
    description:
      "Compute an explicitly continuity-corrected paired-discordance contribution without a p-value or significance rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOnly: { type: "integer", minimum: 0 },
        secondOnly: { type: "integer", minimum: 0 },
        continuityCorrection: { type: "number", minimum: 0 },
      },
      required: ["firstOnly", "secondOnly", "continuityCorrection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        correctedAbsoluteDifference: { type: "number" },
        statistic: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "difference",
        "correctedAbsoluteDifference",
        "statistic",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "firstOnly",
          label: "First Only",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondOnly",
          label: "Second Only",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "continuityCorrection",
          label: "Continuity Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        {
          id: "correctedAbsoluteDifference",
          label: "Corrected Absolute Difference",
          valueType: { type: "number" },
        },
        { id: "statistic", label: "Statistic", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = pairedBinaryDiscordanceTermTool.execute;
export default pairedBinaryDiscordanceTermTool;
