import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetFeed: number;
  readonly moisture: number;
  readonly targetDryMatter: number;
};
export type Output = {
  readonly dryFeed: number;
  readonly requiredWetFeed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetFeed: { type: "number", minimum: 0 },
    moisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    targetDryMatter: { type: "number", minimum: 0 },
  },
  required: ["wetFeed", "moisture", "targetDryMatter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryFeed: { type: "number" },
    requiredWetFeed: { type: "number" },
  },
  required: ["dryFeed", "requiredWetFeed"],
} as const;
/** Calculate pond feed moisture dry matter factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetFeed, moisture, targetDryMatter } = request;
  const compute = (): Output => {
    H.domain(
      wetFeed >= 0 && moisture >= 0 && moisture < 1 && targetDryMatter >= 0,
    );
    return {
      dryFeed: wetFeed * (1 - moisture),
      requiredWetFeed: targetDryMatter / (1 - moisture),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetFeed: 100, moisture: 0.2, targetDryMatter: 40 },
  output: { dryFeed: 80, requiredWetFeed: 50 },
} satisfies ToolExample<Input, Output>;
export const pondFeedMoistureDryMatterFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/pond-feed-moisture-dry-matter-factor",
    title: "Pond Feed Moisture Dry Matter Factor Tool",
    description:
      "Calculate pond feed moisture dry matter factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetFeed: { type: "number", minimum: 0 },
        moisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        targetDryMatter: { type: "number", minimum: 0 },
      },
      required: ["wetFeed", "moisture", "targetDryMatter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryFeed: { type: "number" },
        requiredWetFeed: { type: "number" },
      },
      required: ["dryFeed", "requiredWetFeed"],
    },
    ports: {
      inputs: [
        {
          id: "wetFeed",
          label: "Wet Feed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moisture",
          label: "Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetDryMatter",
          label: "Target Dry Matter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryFeed", label: "Dry Feed", valueType: { type: "number" } },
        {
          id: "requiredWetFeed",
          label: "Required Wet Feed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pondFeedMoistureDryMatterFactorTool.execute;
export default pondFeedMoistureDryMatterFactorTool;
