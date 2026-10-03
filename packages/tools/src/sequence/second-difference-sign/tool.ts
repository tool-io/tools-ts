import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as finiteDifferenceWeight } from "../../sequence/finite-difference-binomial-weight-term/tool.js";
export type Input = {
  readonly first: number;
  readonly second: number;
  readonly third: number;
  readonly tolerance: number;
  readonly equalityWithinTolerance: boolean;
};
export type Output = { readonly sign: number; readonly difference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    third: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
    equalityWithinTolerance: { type: "boolean" },
  },
  required: [
    "first",
    "second",
    "third",
    "tolerance",
    "equalityWithinTolerance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sign: { type: "integer" }, difference: { type: "number" } },
  required: ["sign", "difference"],
} as const;
/** Classify one three-term second difference under an explicit tolerance policy, reusing the finite-difference weight primitive with centered observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, third, tolerance, equalityWithinTolerance } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    const weights = [0, 1, 2].map((index) =>
      Number(finiteDifferenceWeight({ order: 2, index }).coefficient),
    );
    const difference = H.dot([first - second, 0, third - second], weights);
    const equal = equalityWithinTolerance
      ? Math.abs(difference) <= tolerance
      : Math.abs(difference) < tolerance;
    return {
      sign: equal || difference === 0 ? 0 : difference > 0 ? 1 : -1,
      difference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    first: 1,
    second: 2,
    third: 4,
    tolerance: 0,
    equalityWithinTolerance: true,
  },
  output: { sign: 1, difference: 1 },
} satisfies ToolExample<Input, Output>;
export const secondDifferenceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/second-difference-sign",
    title: "Second Difference Sign Tool",
    description:
      "Classify one three-term second difference under an explicit tolerance policy, reusing the finite-difference weight primitive with centered observations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        third: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
        equalityWithinTolerance: { type: "boolean" },
      },
      required: [
        "first",
        "second",
        "third",
        "tolerance",
        "equalityWithinTolerance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sign: { type: "integer" }, difference: { type: "number" } },
      required: ["sign", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "third",
          label: "Third",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityWithinTolerance",
          label: "Equality Within Tolerance",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = secondDifferenceSignTool.execute;
export default secondDifferenceSignTool;
