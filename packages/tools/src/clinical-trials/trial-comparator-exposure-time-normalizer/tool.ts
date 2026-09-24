import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeEvents: number;
  readonly comparatorEvents: number;
  readonly activePersonTime: number;
  readonly comparatorPersonTime: number;
  readonly referenceBase: number;
};
export type Output = {
  readonly activeRate: number;
  readonly comparatorRate: number;
  readonly rateDifference: number;
  readonly rateRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeEvents: { type: "integer", minimum: 0 },
    comparatorEvents: { type: "integer", minimum: 1 },
    activePersonTime: { type: "number", exclusiveMinimum: 0 },
    comparatorPersonTime: { type: "number", exclusiveMinimum: 0 },
    referenceBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "activeEvents",
    "comparatorEvents",
    "activePersonTime",
    "comparatorPersonTime",
    "referenceBase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeRate: { type: "number" },
    comparatorRate: { type: "number" },
    rateDifference: { type: "number" },
    rateRatio: { type: "number" },
  },
  required: ["activeRate", "comparatorRate", "rateDifference", "rateRatio"],
} as const;
/** Calculate trial comparator exposure time normalizer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    activeEvents,
    comparatorEvents,
    activePersonTime,
    comparatorPersonTime,
    referenceBase,
  } = request;
  const compute = (): Output => {
    H.integer(activeEvents, 0);
    H.integer(comparatorEvents, 1);
    H.positive(activePersonTime);
    H.positive(comparatorPersonTime);
    H.positive(referenceBase);
    return {
      activeRate: (activeEvents * referenceBase) / activePersonTime,
      comparatorRate: (comparatorEvents * referenceBase) / comparatorPersonTime,
      rateDifference:
        referenceBase *
        (activeEvents / activePersonTime -
          comparatorEvents / comparatorPersonTime),
      rateRatio:
        (activeEvents * comparatorPersonTime) /
        (comparatorEvents * activePersonTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activeEvents: 10,
    comparatorEvents: 20,
    activePersonTime: 100,
    comparatorPersonTime: 400,
    referenceBase: 100,
  },
  output: {
    activeRate: 10,
    comparatorRate: 5,
    rateDifference: 5,
    rateRatio: 2,
  },
} satisfies ToolExample<Input, Output>;
export const trialComparatorExposureTimeNormalizerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-trials/trial-comparator-exposure-time-normalizer",
      title: "Trial Comparator Exposure Time Normalizer Tool",
      description:
        "Calculate trial comparator exposure time normalizer from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activeEvents: { type: "integer", minimum: 0 },
          comparatorEvents: { type: "integer", minimum: 1 },
          activePersonTime: { type: "number", exclusiveMinimum: 0 },
          comparatorPersonTime: { type: "number", exclusiveMinimum: 0 },
          referenceBase: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "activeEvents",
          "comparatorEvents",
          "activePersonTime",
          "comparatorPersonTime",
          "referenceBase",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activeRate: { type: "number" },
          comparatorRate: { type: "number" },
          rateDifference: { type: "number" },
          rateRatio: { type: "number" },
        },
        required: [
          "activeRate",
          "comparatorRate",
          "rateDifference",
          "rateRatio",
        ],
      },
      ports: {
        inputs: [
          {
            id: "activeEvents",
            label: "Active Events",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "comparatorEvents",
            label: "Comparator Events",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "activePersonTime",
            label: "Active Person Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "comparatorPersonTime",
            label: "Comparator Person Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceBase",
            label: "Reference Base",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "activeRate",
            label: "Active Rate",
            valueType: { type: "number" },
          },
          {
            id: "comparatorRate",
            label: "Comparator Rate",
            valueType: { type: "number" },
          },
          {
            id: "rateDifference",
            label: "Rate Difference",
            valueType: { type: "number" },
          },
          {
            id: "rateRatio",
            label: "Rate Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = trialComparatorExposureTimeNormalizerTool.execute;
export default trialComparatorExposureTimeNormalizerTool;
