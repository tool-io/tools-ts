import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstProperPartOfSecond: boolean;
  readonly secondProperPartOfFirst: boolean;
};
export type Output = { readonly violation: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstProperPartOfSecond: { type: "boolean" },
    secondProperPartOfFirst: { type: "boolean" },
  },
  required: ["firstProperPartOfSecond", "secondProperPartOfFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { violation: { type: "boolean" } },
  required: ["violation"],
} as const;
/** Check an asymmetry counterexample from two explicit proper-part relation values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstProperPartOfSecond, secondProperPartOfFirst } = request;
  const compute = (): Output => {
    return { violation: firstProperPartOfSecond && secondProperPartOfFirst };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstProperPartOfSecond: true, secondProperPartOfFirst: true },
  output: { violation: true },
} satisfies ToolExample<Input, Output>;
export const mereologyProperPartAsymmetryWitnessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "philosophy/mereology-proper-part-asymmetry-witness",
      title: "Mereology Proper Part Asymmetry Witness Tool",
      description:
        "Check an asymmetry counterexample from two explicit proper-part relation values.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstProperPartOfSecond: { type: "boolean" },
          secondProperPartOfFirst: { type: "boolean" },
        },
        required: ["firstProperPartOfSecond", "secondProperPartOfFirst"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { violation: { type: "boolean" } },
        required: ["violation"],
      },
      ports: {
        inputs: [
          {
            id: "firstProperPartOfSecond",
            label: "First Proper Part Of Second",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "secondProperPartOfFirst",
            label: "Second Proper Part Of First",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "violation",
            label: "Violation",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = mereologyProperPartAsymmetryWitnessTool.execute;
export default mereologyProperPartAsymmetryWitnessTool;
