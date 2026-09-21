import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly flowering: readonly boolean[];
  readonly weatherValid: readonly boolean[];
  readonly observed: readonly boolean[];
};
export type Output = {
  readonly eligibleDuration: number;
  readonly observedEligibleDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    flowering: { type: "array", maxItems: 256, items: { type: "boolean" } },
    weatherValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["durations", "flowering", "weatherValid", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleDuration: { type: "number" },
    observedEligibleDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "eligibleDuration",
    "observedEligibleDuration",
    "share",
    "defined",
  ],
} as const;
/** Calculate pollinator valid window share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, flowering, weatherValid, observed } = request;
  const compute = (): Output => {
    H.sameLength(durations, flowering);
    H.sameLength(durations, weatherValid);
    H.sameLength(durations, observed);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const eligibleDuration = durations.reduce(
          (s, x, i) => s + (flowering[i] && weatherValid[i] ? x : 0),
          0,
        ),
        observedEligibleDuration = durations.reduce(
          (s, x, i) =>
            s + (flowering[i] && weatherValid[i] && observed[i] ? x : 0),
          0,
        );
      return {
        eligibleDuration,
        observedEligibleDuration,
        share:
          eligibleDuration > 0
            ? observedEligibleDuration / eligibleDuration
            : 0,
        defined: eligibleDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    durations: [2, 3, 5],
    flowering: [true, true, false],
    weatherValid: [true, true, true],
    observed: [true, false, true],
  },
  output: {
    eligibleDuration: 5,
    observedEligibleDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const pollinatorValidWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/pollinator-valid-window-share",
    title: "Pollinator Valid Window Share Tool",
    description:
      "Calculate pollinator valid window share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        flowering: { type: "array", maxItems: 256, items: { type: "boolean" } },
        weatherValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["durations", "flowering", "weatherValid", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleDuration: { type: "number" },
        observedEligibleDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "eligibleDuration",
        "observedEligibleDuration",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "flowering",
          label: "Flowering",
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
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "eligibleDuration",
          label: "Eligible Duration",
          valueType: { type: "number" },
        },
        {
          id: "observedEligibleDuration",
          label: "Observed Eligible Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = pollinatorValidWindowShareTool.execute;
export default pollinatorValidWindowShareTool;
