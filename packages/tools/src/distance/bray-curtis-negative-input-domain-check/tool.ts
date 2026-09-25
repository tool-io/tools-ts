import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
};
export type Output = {
  readonly nonnegativeDomain: boolean;
  readonly positiveDenominator: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nonnegativeDomain: { type: "boolean" },
    positiveDenominator: { type: "boolean" },
  },
  required: ["nonnegativeDomain", "positiveDenominator"],
} as const;
/** Calculate bray curtis negative input domain check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.sameLength(first, second);
    return {
      nonnegativeDomain:
        first.every((x) => x >= 0) && second.every((x) => x >= 0),
      positiveDenominator:
        first.reduce((a, b) => a + b, 0) + second.reduce((a, b) => a + b, 0) >
        0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [1, -2], second: [3, 4] },
  output: { nonnegativeDomain: false, positiveDenominator: true },
} satisfies ToolExample<Input, Output>;
export const brayCurtisNegativeInputDomainCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/bray-curtis-negative-input-domain-check",
    title: "Bray Curtis Negative Input Domain Check Tool",
    description:
      "Calculate bray curtis negative input domain check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nonnegativeDomain: { type: "boolean" },
        positiveDenominator: { type: "boolean" },
      },
      required: ["nonnegativeDomain", "positiveDenominator"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "nonnegativeDomain",
          label: "Nonnegative Domain",
          valueType: { type: "boolean" },
        },
        {
          id: "positiveDenominator",
          label: "Positive Denominator",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = brayCurtisNegativeInputDomainCheckTool.execute;
export default brayCurtisNegativeInputDomainCheckTool;
