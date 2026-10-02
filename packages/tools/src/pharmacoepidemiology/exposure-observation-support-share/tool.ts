import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exposureDurations: readonly number[];
  readonly observed: readonly boolean[];
  readonly codingVerified: readonly boolean[];
  readonly eligibilityKnown: readonly boolean[];
};
export type Output = {
  readonly exposureTime: number;
  readonly supportedTime: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposureDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    codingVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    eligibilityKnown: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "exposureDurations",
    "observed",
    "codingVerified",
    "eligibilityKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposureTime: { type: "number" },
    supportedTime: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["exposureTime", "supportedTime", "share", "defined"],
} as const;
/** Calculate exposure observation support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exposureDurations, observed, codingVerified, eligibilityKnown } =
    request;
  const compute = (): Output => {
    H.sameLength(exposureDurations, observed);
    H.sameLength(exposureDurations, codingVerified);
    H.sameLength(exposureDurations, eligibilityKnown);
    H.domain(exposureDurations.every((x) => x >= 0));
    return (() => {
      const exposureTime = exposureDurations.reduce((a, b) => a + b, 0),
        supportedTime = exposureDurations.reduce(
          (s, x, i) =>
            s +
            (observed[i] && codingVerified[i] && eligibilityKnown[i] ? x : 0),
          0,
        );
      return {
        exposureTime,
        supportedTime,
        share: exposureTime > 0 ? supportedTime / exposureTime : 0,
        defined: exposureTime > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exposureDurations: [2, 3, 5],
    observed: [true, true, true],
    codingVerified: [true, true, false],
    eligibilityKnown: [true, false, true],
  },
  output: { exposureTime: 10, supportedTime: 2, share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const exposureObservationSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacoepidemiology/exposure-observation-support-share",
    title: "Exposure Observation Support Share Tool",
    description:
      "Calculate exposure observation support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposureDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        codingVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        eligibilityKnown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "exposureDurations",
        "observed",
        "codingVerified",
        "eligibilityKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposureTime: { type: "number" },
        supportedTime: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["exposureTime", "supportedTime", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "exposureDurations",
          label: "Exposure Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "codingVerified",
          label: "Coding Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "eligibilityKnown",
          label: "Eligibility Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "exposureTime",
          label: "Exposure Time",
          valueType: { type: "number" },
        },
        {
          id: "supportedTime",
          label: "Supported Time",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = exposureObservationSupportShareTool.execute;
export default exposureObservationSupportShareTool;
