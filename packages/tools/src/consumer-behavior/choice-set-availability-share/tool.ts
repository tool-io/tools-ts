import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly options: readonly string[];
  readonly available: readonly boolean[];
  readonly excluded: readonly string[];
};
export type Output = {
  readonly availableCount: number;
  readonly eligibleCount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    options: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    available: { type: "array", maxItems: 256, items: { type: "boolean" } },
    excluded: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["options", "available", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableCount: { type: "integer" },
    eligibleCount: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["availableCount", "eligibleCount", "share", "defined"],
} as const;
/** Audit supplied choice-set availability without inferring preferences or purchase behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { options, available, excluded } = request;
  const compute = (): Output => {
    H.sameLength(options, available);
    H.domain(new Set(options).size === options.length);
    const eligibleCount = options.filter((x) => !excluded.includes(x)).length,
      availableCount = options.filter(
        (x, i) => !excluded.includes(x) && available[i],
      ).length;
    return {
      availableCount,
      eligibleCount,
      share: eligibleCount > 0 ? availableCount / eligibleCount : 0,
      defined: eligibleCount > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    options: ["A", "B", "C"],
    available: [true, false, true],
    excluded: ["C"],
  },
  output: { availableCount: 1, eligibleCount: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const choiceSetAvailabilityShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "consumer-behavior/choice-set-availability-share",
    title: "Choice Set Availability Share Tool",
    description:
      "Audit supplied choice-set availability without inferring preferences or purchase behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        options: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        available: { type: "array", maxItems: 256, items: { type: "boolean" } },
        excluded: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["options", "available", "excluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableCount: { type: "integer" },
        eligibleCount: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["availableCount", "eligibleCount", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "options",
          label: "Options",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "availableCount",
          label: "Available Count",
          valueType: { type: "integer" },
        },
        {
          id: "eligibleCount",
          label: "Eligible Count",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = choiceSetAvailabilityShareTool.execute;
export default choiceSetAvailabilityShareTool;
