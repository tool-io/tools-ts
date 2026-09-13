import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualNeetQualifiedYouth: number;
  readonly actualEligibleYouth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNeetQualifiedYouth",
    label: "Actual neet qualified youth",
    kind: "number",
  },
  { id: "actualEligibleYouth", label: "Actual eligible youth", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualNeetQualifiedYouth,
    "actualNeetQualifiedYouth",
    0,
    1000000,
  );
  bounded(input.actualEligibleYouth, "actualEligibleYouth", 1, 1000000);
  if (input.actualNeetQualifiedYouth > input.actualEligibleYouth)
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value: (100 * input.actualNeetQualifiedYouth) / input.actualEligibleYouth,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualNeetQualifiedYouth: 2, actualEligibleYouth: 4 },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/neet-rate",
  title: "NEET Rate Calculator",
  description:
    "Actual NEET percentage. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
