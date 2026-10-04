import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cpm: number;
  readonly clickThroughRateFraction: number;
};
export type Output = { readonly impliedCpc: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cpm: { type: "number", minimum: 0 },
    clickThroughRateFraction: {
      type: "number",
      exclusiveMinimum: 0,
      maximum: 1,
    },
  },
  required: ["cpm", "clickThroughRateFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { impliedCpc: { type: "number" } },
  required: ["impliedCpc"],
} as const;
/** Translate cost per thousand impressions into implied cost per click at a supplied positive CTR fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cpm, clickThroughRateFraction } = request;
  const compute = (): Output => {
    H.domain(cpm >= 0, "cpm");
    H.domain(
      clickThroughRateFraction > 0 && clickThroughRateFraction <= 1,
      "clickThroughRateFraction",
    );
    return { impliedCpc: cpm / (1000 * clickThroughRateFraction) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cpm: 10, clickThroughRateFraction: 0.02 },
  output: { impliedCpc: 0.5 },
} satisfies ToolExample<Input, Output>;
export const mediaBuyCpmCpcCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/media-buy-cpm-cpc-crosswalk",
    title: "Media Buy Cpm Cpc Crosswalk Tool",
    description:
      "Translate cost per thousand impressions into implied cost per click at a supplied positive CTR fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cpm: { type: "number", minimum: 0 },
        clickThroughRateFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: ["cpm", "clickThroughRateFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { impliedCpc: { type: "number" } },
      required: ["impliedCpc"],
    },
    ports: {
      inputs: [
        {
          id: "cpm",
          label: "Cpm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clickThroughRateFraction",
          label: "Click Through Rate Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "impliedCpc",
          label: "Implied Cpc",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mediaBuyCpmCpcCrosswalkTool.execute;
export default mediaBuyCpmCpcCrosswalkTool;
