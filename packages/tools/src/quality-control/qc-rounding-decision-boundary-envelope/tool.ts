import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reported: number;
  readonly increment: number;
  readonly limit: number;
  readonly upperLimit: boolean;
};
export type Output = {
  readonly minimum: number;
  readonly maximum: number;
  readonly definitelyPass: boolean;
  readonly definitelyFail: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reported: { type: "number" },
    increment: { type: "number", exclusiveMinimum: 0 },
    limit: { type: "number" },
    upperLimit: { type: "boolean" },
  },
  required: ["reported", "increment", "limit", "upperLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimum: { type: "number" },
    maximum: { type: "number" },
    definitelyPass: { type: "boolean" },
    definitelyFail: { type: "boolean" },
  },
  required: ["minimum", "maximum", "definitelyPass", "definitelyFail"],
} as const;
/** Bound a reported rounded result before applying an explicit one-sided decision limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reported, increment, limit, upperLimit } = request;
  const compute = (): Output => {
    H.positive(increment);
    return {
      minimum: reported - increment / 2,
      maximum: reported + increment / 2,
      definitelyPass: upperLimit
        ? reported + increment / 2 <= limit
        : reported - increment / 2 >= limit,
      definitelyFail: upperLimit
        ? reported - increment / 2 > limit
        : reported + increment / 2 < limit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reported: 10, increment: 1, limit: 10, upperLimit: true },
  output: {
    minimum: 9.5,
    maximum: 10.5,
    definitelyPass: false,
    definitelyFail: false,
  },
} satisfies ToolExample<Input, Output>;
export const qcRoundingDecisionBoundaryEnvelopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/qc-rounding-decision-boundary-envelope",
    title: "QC Rounding Decision Boundary Envelope Tool",
    description:
      "Bound a reported rounded result before applying an explicit one-sided decision limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reported: { type: "number" },
        increment: { type: "number", exclusiveMinimum: 0 },
        limit: { type: "number" },
        upperLimit: { type: "boolean" },
      },
      required: ["reported", "increment", "limit", "upperLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimum: { type: "number" },
        maximum: { type: "number" },
        definitelyPass: { type: "boolean" },
        definitelyFail: { type: "boolean" },
      },
      required: ["minimum", "maximum", "definitelyPass", "definitelyFail"],
    },
    ports: {
      inputs: [
        {
          id: "reported",
          label: "Reported",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "increment",
          label: "Increment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperLimit",
          label: "Upper Limit",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "minimum", label: "Minimum", valueType: { type: "number" } },
        { id: "maximum", label: "Maximum", valueType: { type: "number" } },
        {
          id: "definitelyPass",
          label: "Definitely Pass",
          valueType: { type: "boolean" },
        },
        {
          id: "definitelyFail",
          label: "Definitely Fail",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcRoundingDecisionBoundaryEnvelopeTool.execute;
export default qcRoundingDecisionBoundaryEnvelopeTool;
