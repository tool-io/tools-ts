import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  bounded,
  sum,
  expFinite,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRealQ: number;
  readonly actualProductCutoff: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualRealQ", label: "Actual real q", kind: "number" },
  { id: "actualProductCutoff", label: "Actual product cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualRealQ, "q");
  if (input.actualRealQ >= 1) simpleError("q", "Real0<q<1.");
  bounded(input.actualProductCutoff, "cutoff", 1, 10000);
  const x = expFinite(
    Math.log(input.actualRealQ) +
      24 *
        sum(
          Array.from({ length: input.actualProductCutoff }, (_, i) =>
            Math.log1p(-(input.actualRealQ ** (i + 1))),
          ),
        ),
  );
  return { truncatedDelta: x };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRealQ: 0.01, actualProductCutoff: 1 },
  output: { result: { truncatedDelta: 0.007856781408072187 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/modular-form-discriminant-delta",
  title: "Modular Discriminant Delta Calculator",
  description:
    "Finiteq\u03a0n\u2264N(1\u2212q^n)^24 standard modular discriminant\u0394, realqbranch, no full infinite product error certificate, underflow rejected. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
