import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIndex: number;
  readonly suppliedMinutesPerStep: number;
  readonly baselineMinute: number;
};
export type Output = { readonly sampleMinute: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIndex: { type: "integer", minimum: 0 },
    suppliedMinutesPerStep: { type: "number", exclusiveMinimum: 0 },
    baselineMinute: { type: "number" },
  },
  required: ["sampleIndex", "suppliedMinutesPerStep", "baselineMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sampleMinute: { type: "number" } },
  required: ["sampleMinute"],
} as const;
/** Calculate one explicitly indexed digestive-study breath-sample time from supplied step spacing and baseline without recommending a clinical protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIndex, suppliedMinutesPerStep, baselineMinute } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sampleIndex) &&
        sampleIndex >= 0 &&
        sampleIndex <= Number.MAX_SAFE_INTEGER,
      "sampleIndex",
    ),
      sampleIndex);
    (H.domain(
      Number.isFinite(suppliedMinutesPerStep) && suppliedMinutesPerStep > 0,
      "suppliedMinutesPerStep",
    ),
      suppliedMinutesPerStep);
    return {
      sampleMinute: baselineMinute + sampleIndex * suppliedMinutesPerStep,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleIndex: 3, suppliedMinutesPerStep: 15, baselineMinute: 0 },
  output: { sampleMinute: 45 },
} satisfies ToolExample<Input, Output>;
export const digestiveStudyBreathSampleTimePointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gastroenterology/digestive-study-breath-sample-time-point",
      title: "Digestive Study Breath Sample Time Point Tool",
      description:
        "Calculate one explicitly indexed digestive-study breath-sample time from supplied step spacing and baseline without recommending a clinical protocol.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleIndex: { type: "integer", minimum: 0 },
          suppliedMinutesPerStep: { type: "number", exclusiveMinimum: 0 },
          baselineMinute: { type: "number" },
        },
        required: ["sampleIndex", "suppliedMinutesPerStep", "baselineMinute"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { sampleMinute: { type: "number" } },
        required: ["sampleMinute"],
      },
      ports: {
        inputs: [
          {
            id: "sampleIndex",
            label: "Sample Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "suppliedMinutesPerStep",
            label: "Supplied Minutes Per Step",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baselineMinute",
            label: "Baseline Minute",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "sampleMinute",
            label: "Sample Minute",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = digestiveStudyBreathSampleTimePointTool.execute;
export default digestiveStudyBreathSampleTimePointTool;
