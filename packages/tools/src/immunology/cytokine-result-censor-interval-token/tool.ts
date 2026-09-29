import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly limit: number;
  readonly below: boolean;
  readonly inclusive: boolean;
};
export type Output = {
  readonly lowerBound: boolean;
  readonly upperBound: boolean;
  readonly bound: number;
  readonly intervalToken: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    limit: { type: "number", minimum: 0 },
    below: { type: "boolean" },
    inclusive: { type: "boolean" },
  },
  required: ["limit", "below", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerBound: { type: "boolean" },
    upperBound: { type: "boolean" },
    bound: { type: "number" },
    intervalToken: { type: "string", maxLength: 8192 },
  },
  required: ["lowerBound", "upperBound", "bound", "intervalToken"],
} as const;
/** Serialize an explicitly one-sided analytical censor bound without substituting a measured concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { limit, below, inclusive } = request;
  const compute = (): Output => {
    H.domain(limit >= 0);
    return {
      lowerBound: !below,
      upperBound: below,
      bound: limit,
      intervalToken:
        (below ? (inclusive ? "<=" : "<") : inclusive ? ">=" : ">") +
        String(limit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { limit: 5, below: true, inclusive: false },
  output: {
    lowerBound: false,
    upperBound: true,
    bound: 5,
    intervalToken: "<5",
  },
} satisfies ToolExample<Input, Output>;
export const cytokineResultCensorIntervalTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/cytokine-result-censor-interval-token",
    title: "Cytokine Result Censor Interval Token Tool",
    description:
      "Serialize an explicitly one-sided analytical censor bound without substituting a measured concentration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        limit: { type: "number", minimum: 0 },
        below: { type: "boolean" },
        inclusive: { type: "boolean" },
      },
      required: ["limit", "below", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerBound: { type: "boolean" },
        upperBound: { type: "boolean" },
        bound: { type: "number" },
        intervalToken: { type: "string", maxLength: 8192 },
      },
      required: ["lowerBound", "upperBound", "bound", "intervalToken"],
    },
    ports: {
      inputs: [
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "below",
          label: "Below",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "lowerBound",
          label: "Lower Bound",
          valueType: { type: "boolean" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          valueType: { type: "boolean" },
        },
        { id: "bound", label: "Bound", valueType: { type: "number" } },
        {
          id: "intervalToken",
          label: "Interval Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = cytokineResultCensorIntervalTokenTool.execute;
export default cytokineResultCensorIntervalTokenTool;
