import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seeds: number;
  readonly purity: number;
  readonly germination: number;
  readonly requestedLive: number;
};
export type Output = {
  readonly expectedLive: number;
  readonly requiredCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seeds: { type: "integer", minimum: 0 },
    purity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    germination: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    requestedLive: { type: "number", minimum: 0 },
  },
  required: ["seeds", "purity", "germination", "requestedLive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedLive: { type: "number" },
    requiredCount: { type: "integer" },
  },
  required: ["expectedLive", "requiredCount"],
} as const;
/** Calculate seedsharing pure live count factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seeds, purity, germination, requestedLive } = request;
  const compute = (): Output => {
    H.integer(seeds, 0);
    H.domain(
      purity > 0 &&
        purity <= 1 &&
        germination > 0 &&
        germination <= 1 &&
        requestedLive >= 0,
    );
    return {
      expectedLive: seeds * purity * germination,
      requiredCount: Math.ceil(requestedLive / (purity * germination)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seeds: 100, purity: 0.9, germination: 0.8, requestedLive: 50 },
  output: { expectedLive: 72, requiredCount: 70 },
} satisfies ToolExample<Input, Output>;
export const seedsharingPureLiveCountFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/seedsharing-pure-live-count-factor",
    title: "Seedsharing Pure Live Count Factor Tool",
    description:
      "Calculate seedsharing pure live count factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seeds: { type: "integer", minimum: 0 },
        purity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        germination: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        requestedLive: { type: "number", minimum: 0 },
      },
      required: ["seeds", "purity", "germination", "requestedLive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedLive: { type: "number" },
        requiredCount: { type: "integer" },
      },
      required: ["expectedLive", "requiredCount"],
    },
    ports: {
      inputs: [
        {
          id: "seeds",
          label: "Seeds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "purity",
          label: "Purity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "germination",
          label: "Germination",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requestedLive",
          label: "Requested Live",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedLive",
          label: "Expected Live",
          valueType: { type: "number" },
        },
        {
          id: "requiredCount",
          label: "Required Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedsharingPureLiveCountFactorTool.execute;
export default seedsharingPureLiveCountFactorTool;
