import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly options: readonly string[];
  readonly stakeholderOptions: readonly string[];
  readonly excludedOptions: readonly string[];
};
export type Output = {
  readonly availableCount: number;
  readonly excludedCount: number;
  readonly unavailableStakeholderOptions: readonly string[];
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
    stakeholderOptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    excludedOptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["options", "stakeholderOptions", "excludedOptions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableCount: { type: "integer" },
    excludedCount: { type: "integer" },
    unavailableStakeholderOptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "availableCount",
    "excludedCount",
    "unavailableStakeholderOptions",
  ],
} as const;
/** Audit supplied stakeholder option-set membership without ranking ethical preferences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { options, stakeholderOptions, excludedOptions } = request;
  const compute = (): Output => {
    const unique = [...new Set(stakeholderOptions)],
      available = unique.filter(
        (x) => options.includes(x) && !excludedOptions.includes(x),
      );
    return {
      availableCount: available.length,
      excludedCount: unique.filter((x) => excludedOptions.includes(x)).length,
      unavailableStakeholderOptions: unique.filter(
        (x) => !available.includes(x),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    options: ["A", "B", "C"],
    stakeholderOptions: ["A", "B", "X"],
    excludedOptions: ["B"],
  },
  output: {
    availableCount: 1,
    excludedCount: 1,
    unavailableStakeholderOptions: ["B", "X"],
  },
} satisfies ToolExample<Input, Output>;
export const stakeholderOptionExclusionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/stakeholder-option-exclusion-count",
    title: "Stakeholder Option Exclusion Count Tool",
    description:
      "Audit supplied stakeholder option-set membership without ranking ethical preferences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        options: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        stakeholderOptions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        excludedOptions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["options", "stakeholderOptions", "excludedOptions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableCount: { type: "integer" },
        excludedCount: { type: "integer" },
        unavailableStakeholderOptions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "availableCount",
        "excludedCount",
        "unavailableStakeholderOptions",
      ],
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
          id: "stakeholderOptions",
          label: "Stakeholder Options",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "excludedOptions",
          label: "Excluded Options",
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
          id: "excludedCount",
          label: "Excluded Count",
          valueType: { type: "integer" },
        },
        {
          id: "unavailableStakeholderOptions",
          label: "Unavailable Stakeholder Options",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = stakeholderOptionExclusionCountTool.execute;
export default stakeholderOptionExclusionCountTool;
