import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualInteger: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualInteger", label: "Actual integer", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualInteger, "integer", 0, 1000);
  if (input.actualInteger === 0)
    return { isUntouchable: false, smallestProperDivisorSumWitness: 1 };
  if (input.actualInteger === 1)
    return { isUntouchable: false, smallestProperDivisorSumWitness: 2 };
  const end = input.actualInteger ** 2,
    sums = new Uint32Array(end + 1);
  for (let d = 1; d <= end / 2; d++)
    for (let m = 2 * d; m <= end; m += d) sums[m] += d;
  for (let m = 1; m <= end; m++)
    if (sums[m] === input.actualInteger)
      return { isUntouchable: false, smallestProperDivisorSumWitness: m };
  return { isUntouchable: true, smallestProperDivisorSumWitness: 0 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualInteger: 5 },
  output: {
    result: { isUntouchable: true, smallestProperDivisorSumWitness: 0 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/untouchable-number-checker",
  title: "Untouchable Number Checker",
  description:
    "Exact bounded untouchable integer0\u20131000underpreimagem\u22651 convention;0touchedbym1,1bym2. Forn\u22652 primepreimages cannot occur; everycompositemhaslargestproperdivisor\u2265\u221am, so anypreimagesatisfiesm\u2264n\u00b2. Sieve complete bound, zero witness means absent.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
