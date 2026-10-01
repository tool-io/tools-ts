import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly constantOutput: number;
};
export type Output = {
  readonly normalized: number;
  readonly constant: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    minimum: { type: "number" },
    maximum: { type: "number" },
    constantOutput: { type: "number" },
  },
  required: ["value", "minimum", "maximum", "constantOutput"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalized: { type: "number" }, constant: { type: "boolean" } },
  required: ["normalized", "constant"],
} as const;
/** Calculate minmax constant column output policy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, minimum, maximum, constantOutput } = request;
  const compute = (): Output => {
    H.domain(minimum <= maximum);
    const constant = minimum === maximum;
    H.domain(!constant || value === minimum);
    return {
      normalized: constant
        ? constantOutput
        : (value - minimum) / (maximum - minimum),
      constant,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 3, minimum: 3, maximum: 3, constantOutput: 0.5 },
  output: { normalized: 0.5, constant: true },
} satisfies ToolExample<Input, Output>;
export const minmaxConstantColumnOutputPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/minmax-constant-column-output-policy",
    title: "Minmax Constant Column Output Policy Tool",
    description:
      "Calculate minmax constant column output policy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        minimum: { type: "number" },
        maximum: { type: "number" },
        constantOutput: { type: "number" },
      },
      required: ["value", "minimum", "maximum", "constantOutput"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalized: { type: "number" },
        constant: { type: "boolean" },
      },
      required: ["normalized", "constant"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimum",
          label: "Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "constantOutput",
          label: "Constant Output",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "number" },
        },
        { id: "constant", label: "Constant", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = minmaxConstantColumnOutputPolicyTool.execute;
export default minmaxConstantColumnOutputPolicyTool;
