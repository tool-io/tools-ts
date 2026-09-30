import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly brandMentions: number;
  readonly competitorMentions: number;
  readonly otherMentions: number;
  readonly includeOther: boolean;
};
export type Output = { readonly denominator: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    brandMentions: { type: "integer", minimum: 0 },
    competitorMentions: { type: "integer", minimum: 0 },
    otherMentions: { type: "integer", minimum: 0 },
    includeOther: { type: "boolean" },
  },
  required: [
    "brandMentions",
    "competitorMentions",
    "otherMentions",
    "includeOther",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "integer" }, share: { type: "number" } },
  required: ["denominator", "share"],
} as const;
/** Calculate brand mention share explicit corpus from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { brandMentions, competitorMentions, otherMentions, includeOther } =
    request;
  const compute = (): Output => {
    H.integer(brandMentions, 0);
    H.integer(competitorMentions, 0);
    H.integer(otherMentions, 0);
    H.domain(
      brandMentions + competitorMentions + (includeOther ? otherMentions : 0) >
        0,
    );
    return {
      denominator:
        brandMentions + competitorMentions + (includeOther ? otherMentions : 0),
      share:
        brandMentions /
        (brandMentions +
          competitorMentions +
          (includeOther ? otherMentions : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    brandMentions: 20,
    competitorMentions: 60,
    otherMentions: 20,
    includeOther: true,
  },
  output: { denominator: 100, share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const brandMentionShareExplicitCorpusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/brand-mention-share-explicit-corpus",
    title: "Brand Mention Share Explicit Corpus Tool",
    description:
      "Calculate brand mention share explicit corpus from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        brandMentions: { type: "integer", minimum: 0 },
        competitorMentions: { type: "integer", minimum: 0 },
        otherMentions: { type: "integer", minimum: 0 },
        includeOther: { type: "boolean" },
      },
      required: [
        "brandMentions",
        "competitorMentions",
        "otherMentions",
        "includeOther",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        share: { type: "number" },
      },
      required: ["denominator", "share"],
    },
    ports: {
      inputs: [
        {
          id: "brandMentions",
          label: "Brand Mentions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "competitorMentions",
          label: "Competitor Mentions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "otherMentions",
          label: "Other Mentions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeOther",
          label: "Include Other",
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
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = brandMentionShareExplicitCorpusTool.execute;
export default brandMentionShareExplicitCorpusTool;
