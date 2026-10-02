import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cdfBefore: number;
  readonly cdfAt: number;
  readonly inclusive: boolean;
};
export type Output = {
  readonly eventProbability: number;
  readonly boundaryMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cdfBefore: { type: "number", minimum: 0, maximum: 1 },
    cdfAt: { type: "number", minimum: 0, maximum: 1 },
    inclusive: { type: "boolean" },
  },
  required: ["cdfBefore", "cdfAt", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventProbability: { type: "number" },
    boundaryMass: { type: "number" },
  },
  required: ["eventProbability", "boundaryMass"],
} as const;
/** Distinguish P(X<t) from P(X<=t) using supplied left-limit and endpoint CDF values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cdfBefore, cdfAt, inclusive } = request;
  const compute = (): Output => {
    H.probability(cdfBefore);
    H.probability(cdfAt);
    H.domain(cdfBefore <= cdfAt);
    return {
      eventProbability: inclusive ? cdfAt : cdfBefore,
      boundaryMass: cdfAt - cdfBefore,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cdfBefore: 0.3, cdfAt: 0.5, inclusive: true },
  output: { eventProbability: 0.5, boundaryMass: 0.2 },
} satisfies ToolExample<Input, Output>;
export const censoredEventBoundaryMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/censored-event-boundary-mass",
    title: "Censored Event Boundary Mass Tool",
    description:
      "Distinguish P(X<t) from P(X<=t) using supplied left-limit and endpoint CDF values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cdfBefore: { type: "number", minimum: 0, maximum: 1 },
        cdfAt: { type: "number", minimum: 0, maximum: 1 },
        inclusive: { type: "boolean" },
      },
      required: ["cdfBefore", "cdfAt", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventProbability: { type: "number" },
        boundaryMass: { type: "number" },
      },
      required: ["eventProbability", "boundaryMass"],
    },
    ports: {
      inputs: [
        {
          id: "cdfBefore",
          label: "Cdf Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cdfAt",
          label: "Cdf At",
          required: true,
          valueType: { type: "number" },
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
          id: "eventProbability",
          label: "Event Probability",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "boundaryMass",
          label: "Boundary Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = censoredEventBoundaryMassTool.execute;
export default censoredEventBoundaryMassTool;
