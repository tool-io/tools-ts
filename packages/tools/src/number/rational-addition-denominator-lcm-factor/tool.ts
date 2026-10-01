import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly lcm: number;
  readonly firstFactor: number;
  readonly secondFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 1 },
    second: { type: "integer", minimum: 1 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lcm: { type: "integer" },
    firstFactor: { type: "integer" },
    secondFactor: { type: "integer" },
  },
  required: ["lcm", "firstFactor", "secondFactor"],
} as const;
/** Calculate rational addition denominator lcm factor from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second } = input;
  const compute = (): Output => {
    H.integer(first, 1);
    H.integer(second, 1);
    let a = first,
      b = second;
    while (b) {
      const r = a % b;
      a = b;
      b = r;
    }
    const lcm = (first / a) * second;
    H.integer(lcm, 1);
    return { lcm, firstFactor: lcm / first, secondFactor: lcm / second };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 6, second: 8 },
  output: { lcm: 24, firstFactor: 4, secondFactor: 3 },
} satisfies ToolExample<Input, Output>;
export const rationalAdditionDenominatorLcmFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "number/rational-addition-denominator-lcm-factor",
      title: "Rational Addition Denominator Lcm Factor Tool",
      description:
        "Calculate rational addition denominator lcm factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "integer", minimum: 1 },
          second: { type: "integer", minimum: 1 },
        },
        required: ["first", "second"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lcm: { type: "integer" },
          firstFactor: { type: "integer" },
          secondFactor: { type: "integer" },
        },
        required: ["lcm", "firstFactor", "secondFactor"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "lcm", label: "Lcm", valueType: { type: "integer" } },
          {
            id: "firstFactor",
            label: "First Factor",
            valueType: { type: "integer" },
          },
          {
            id: "secondFactor",
            label: "Second Factor",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rationalAdditionDenominatorLcmFactorTool.execute;
export default rationalAdditionDenominatorLcmFactorTool;
