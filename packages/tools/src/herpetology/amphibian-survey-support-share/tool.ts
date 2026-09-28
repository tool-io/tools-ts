import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitDurations: readonly number[];
  readonly habitatEligible: readonly boolean[];
  readonly weatherValid: readonly boolean[];
  readonly observerPresent: readonly boolean[];
};
export type Output = {
  readonly eligibleTime: number;
  readonly supportedTime: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    habitatEligible: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    weatherValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    observerPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "visitDurations",
    "habitatEligible",
    "weatherValid",
    "observerPresent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleTime: { type: "number" },
    supportedTime: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligibleTime", "supportedTime", "share", "defined"],
} as const;
/** Calculate amphibian survey support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitDurations, habitatEligible, weatherValid, observerPresent } =
    request;
  const compute = (): Output => {
    H.sameLength(visitDurations, habitatEligible);
    H.sameLength(visitDurations, weatherValid);
    H.sameLength(visitDurations, observerPresent);
    H.domain(visitDurations.every((x) => x >= 0));
    return (() => {
      const eligibleTime = visitDurations.reduce(
          (s, x, i) => s + (habitatEligible[i] ? x : 0),
          0,
        ),
        supportedTime = visitDurations.reduce(
          (s, x, i) =>
            s +
            (habitatEligible[i] && weatherValid[i] && observerPresent[i]
              ? x
              : 0),
          0,
        );
      return {
        eligibleTime,
        supportedTime,
        share: eligibleTime > 0 ? supportedTime / eligibleTime : 0,
        defined: eligibleTime > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    visitDurations: [2, 3, 5],
    habitatEligible: [true, true, false],
    weatherValid: [true, true, true],
    observerPresent: [true, false, true],
  },
  output: { eligibleTime: 5, supportedTime: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const amphibianSurveySupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/amphibian-survey-support-share",
    title: "Amphibian Survey Support Share Tool",
    description:
      "Calculate amphibian survey support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        habitatEligible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        weatherValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        observerPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "visitDurations",
        "habitatEligible",
        "weatherValid",
        "observerPresent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleTime: { type: "number" },
        supportedTime: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligibleTime", "supportedTime", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "visitDurations",
          label: "Visit Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "habitatEligible",
          label: "Habitat Eligible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "weatherValid",
          label: "Weather Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "observerPresent",
          label: "Observer Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "eligibleTime",
          label: "Eligible Time",
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
export const run = amphibianSurveySupportShareTool.execute;
export default amphibianSurveySupportShareTool;
