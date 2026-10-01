import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialWeights: readonly number[];
  readonly stimulusVerified: readonly boolean[];
  readonly viewingConditionValid: readonly boolean[];
  readonly responseRecorded: readonly boolean[];
};
export type Output = {
  readonly totalWeight: number;
  readonly supportedWeight: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    stimulusVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    viewingConditionValid: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    responseRecorded: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "trialWeights",
    "stimulusVerified",
    "viewingConditionValid",
    "responseRecorded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWeight: { type: "number" },
    supportedWeight: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalWeight", "supportedWeight", "share", "defined"],
} as const;
/** Calculate visual test support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    trialWeights,
    stimulusVerified,
    viewingConditionValid,
    responseRecorded,
  } = request;
  const compute = (): Output => {
    H.sameLength(trialWeights, stimulusVerified);
    H.sameLength(trialWeights, viewingConditionValid);
    H.sameLength(trialWeights, responseRecorded);
    H.domain(trialWeights.every((x) => x >= 0));
    return (() => {
      const totalWeight = trialWeights.reduce((a, b) => a + b, 0),
        supportedWeight = trialWeights.reduce(
          (s, x, i) =>
            s +
            (stimulusVerified[i] &&
            viewingConditionValid[i] &&
            responseRecorded[i]
              ? x
              : 0),
          0,
        );
      return {
        totalWeight,
        supportedWeight,
        share: totalWeight > 0 ? supportedWeight / totalWeight : 0,
        defined: totalWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trialWeights: [2, 3, 5],
    stimulusVerified: [true, true, true],
    viewingConditionValid: [true, true, false],
    responseRecorded: [true, false, true],
  },
  output: { totalWeight: 10, supportedWeight: 2, share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const visualTestSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/visual-test-support-share",
    title: "Visual Test Support Share Tool",
    description:
      "Calculate visual test support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        stimulusVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        viewingConditionValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        responseRecorded: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "trialWeights",
        "stimulusVerified",
        "viewingConditionValid",
        "responseRecorded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalWeight: { type: "number" },
        supportedWeight: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalWeight", "supportedWeight", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "trialWeights",
          label: "Trial Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "stimulusVerified",
          label: "Stimulus Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "viewingConditionValid",
          label: "Viewing Condition Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "responseRecorded",
          label: "Response Recorded",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        {
          id: "supportedWeight",
          label: "Supported Weight",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = visualTestSupportShareTool.execute;
export default visualTestSupportShareTool;
