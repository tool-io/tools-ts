import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly successful: number;
  readonly unsuccessful: number;
  readonly unobserved: number;
  readonly includeUnobserved: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly successFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    successful: { type: "integer", minimum: 0 },
    unsuccessful: { type: "integer", minimum: 0 },
    unobserved: { type: "integer", minimum: 0 },
    includeUnobserved: { type: "boolean" },
  },
  required: ["successful", "unsuccessful", "unobserved", "includeUnobserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    successFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "successFraction", "defined"],
} as const;
/** Research repetition denominators with explicit unknown-trial inclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { successful, unsuccessful, unobserved, includeUnobserved } = request;
  const compute = (): Output => {
    H.integer(successful, 0);
    H.integer(unsuccessful, 0);
    H.integer(unobserved, 0);
    return {
      denominator:
        successful + unsuccessful + (includeUnobserved ? unobserved : 0),
      successFraction:
        successful + unsuccessful + (includeUnobserved ? unobserved : 0) > 0
          ? successful /
            (successful + unsuccessful + (includeUnobserved ? unobserved : 0))
          : 0,
      defined:
        successful + unsuccessful + (includeUnobserved ? unobserved : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    successful: 8,
    unsuccessful: 2,
    unobserved: 2,
    includeUnobserved: false,
  },
  output: { denominator: 10, successFraction: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const repetitionCountUnknownTrialBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/repetition-count-unknown-trial-base",
    title: "Repetition Count Unknown Trial Base Tool",
    description:
      "Research repetition denominators with explicit unknown-trial inclusion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        successful: { type: "integer", minimum: 0 },
        unsuccessful: { type: "integer", minimum: 0 },
        unobserved: { type: "integer", minimum: 0 },
        includeUnobserved: { type: "boolean" },
      },
      required: [
        "successful",
        "unsuccessful",
        "unobserved",
        "includeUnobserved",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        successFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "successFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "successful",
          label: "Successful",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unsuccessful",
          label: "Unsuccessful",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unobserved",
          label: "Unobserved",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnobserved",
          label: "Include Unobserved",
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
        {
          id: "successFraction",
          label: "Success Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = repetitionCountUnknownTrialBaseTool.execute;
export default repetitionCountUnknownTrialBaseTool;
