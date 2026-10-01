import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly required: number;
  readonly optional: number;
  readonly completedRequired: number;
  readonly completedOptional: number;
  readonly includeOptional: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly credited: number;
  readonly fraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: { type: "integer", minimum: 0 },
    optional: { type: "integer", minimum: 0 },
    completedRequired: { type: "integer", minimum: 0 },
    completedOptional: { type: "integer", minimum: 0 },
    includeOptional: { type: "boolean" },
  },
  required: [
    "required",
    "optional",
    "completedRequired",
    "completedOptional",
    "includeOptional",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    credited: { type: "integer" },
    fraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "credited", "fraction", "defined"],
} as const;
/** Count supplied required/optional research task steps without assigning functional ability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    required,
    optional,
    completedRequired,
    completedOptional,
    includeOptional,
  } = request;
  const compute = (): Output => {
    H.integer(required, 0);
    H.integer(optional, 0);
    H.integer(completedRequired, 0, required);
    H.integer(completedOptional, 0, optional);
    return {
      denominator: required + (includeOptional ? optional : 0),
      credited: completedRequired + (includeOptional ? completedOptional : 0),
      fraction:
        required + (includeOptional ? optional : 0) > 0
          ? (completedRequired + (includeOptional ? completedOptional : 0)) /
            (required + (includeOptional ? optional : 0))
          : 0,
      defined: required + (includeOptional ? optional : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    required: 8,
    optional: 2,
    completedRequired: 6,
    completedOptional: 2,
    includeOptional: true,
  },
  output: { denominator: 10, credited: 8, fraction: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const activityStepOptionalCountBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/activity-step-optional-count-base",
    title: "Activity Step Optional Count Base Tool",
    description:
      "Count supplied required/optional research task steps without assigning functional ability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "integer", minimum: 0 },
        optional: { type: "integer", minimum: 0 },
        completedRequired: { type: "integer", minimum: 0 },
        completedOptional: { type: "integer", minimum: 0 },
        includeOptional: { type: "boolean" },
      },
      required: [
        "required",
        "optional",
        "completedRequired",
        "completedOptional",
        "includeOptional",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        credited: { type: "integer" },
        fraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "credited", "fraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "optional",
          label: "Optional",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "completedRequired",
          label: "Completed Required",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "completedOptional",
          label: "Completed Optional",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeOptional",
          label: "Include Optional",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        { id: "credited", label: "Credited", valueType: { type: "integer" } },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = activityStepOptionalCountBaseTool.execute;
export default activityStepOptionalCountBaseTool;
