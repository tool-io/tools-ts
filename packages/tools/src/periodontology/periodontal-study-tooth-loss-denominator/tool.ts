import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseline: number;
  readonly lost: number;
  readonly excluded: number;
  readonly examined: number;
  readonly positives: number;
  readonly useBaseline: boolean;
};
export type Output = {
  readonly retained: number;
  readonly denominator: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseline: { type: "integer", minimum: 1 },
    lost: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    examined: { type: "integer", minimum: 1 },
    positives: { type: "integer", minimum: 0 },
    useBaseline: { type: "boolean" },
  },
  required: [
    "baseline",
    "lost",
    "excluded",
    "examined",
    "positives",
    "useBaseline",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retained: { type: "integer" },
    denominator: { type: "integer" },
    fraction: { type: "number" },
  },
  required: ["retained", "denominator", "fraction"],
} as const;
/** Keep baseline and examined denominators explicit after supplied tooth losses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseline, lost, excluded, examined, positives, useBaseline } =
    request;
  const compute = (): Output => {
    H.integer(baseline, 1);
    H.integer(lost, 0);
    H.integer(excluded, 0);
    H.integer(examined, 1, baseline - lost - excluded);
    H.integer(positives, 0, examined);
    return {
      retained: baseline - lost - excluded,
      denominator: useBaseline ? baseline : examined,
      fraction: positives / (useBaseline ? baseline : examined),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseline: 28,
    lost: 2,
    excluded: 2,
    examined: 24,
    positives: 6,
    useBaseline: false,
  },
  output: { retained: 24, denominator: 24, fraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const periodontalStudyToothLossDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "periodontology/periodontal-study-tooth-loss-denominator",
      title: "Periodontal Study Tooth Loss Denominator Tool",
      description:
        "Keep baseline and examined denominators explicit after supplied tooth losses.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseline: { type: "integer", minimum: 1 },
          lost: { type: "integer", minimum: 0 },
          excluded: { type: "integer", minimum: 0 },
          examined: { type: "integer", minimum: 1 },
          positives: { type: "integer", minimum: 0 },
          useBaseline: { type: "boolean" },
        },
        required: [
          "baseline",
          "lost",
          "excluded",
          "examined",
          "positives",
          "useBaseline",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retained: { type: "integer" },
          denominator: { type: "integer" },
          fraction: { type: "number" },
        },
        required: ["retained", "denominator", "fraction"],
      },
      ports: {
        inputs: [
          {
            id: "baseline",
            label: "Baseline",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "lost",
            label: "Lost",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "examined",
            label: "Examined",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "positives",
            label: "Positives",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "useBaseline",
            label: "Use Baseline",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "retained", label: "Retained", valueType: { type: "integer" } },
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = periodontalStudyToothLossDenominatorTool.execute;
export default periodontalStudyToothLossDenominatorTool;
