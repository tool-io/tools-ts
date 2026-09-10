import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredMcaPi: number;
  readonly independentlyMatchedUmbilicalPi: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredMcaPi",
    label: "Independently measured mca pi",
    kind: "number",
  },
  {
    id: "independentlyMatchedUmbilicalPi",
    label: "Independently matched umbilical pi",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredMcaPi, "numerator");
  positive(input.independentlyMatchedUmbilicalPi, "denominator");
  return {
    observedRatio:
      (1 * input.independentlyMeasuredMcaPi) /
      input.independentlyMatchedUmbilicalPi,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyMeasuredMcaPi: 2, independentlyMatchedUmbilicalPi: 4 },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/cerebroplacental-ratio",
  title: "Cerebroplacental Ratio Calculator",
  description:
    "Cerebroplacental ratio using matched independently established MCA/umbilical artery PIs. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
