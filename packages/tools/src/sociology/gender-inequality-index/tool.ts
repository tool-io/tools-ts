import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fraction,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerNormalizedFemaleDomainIndices: readonly number[];
  readonly callerNormalizedMaleDomainIndices: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerNormalizedFemaleDomainIndices",
    label: "Caller normalized female domain indices",
    kind: "numberList",
  },
  {
    id: "callerNormalizedMaleDomainIndices",
    label: "Caller normalized male domain indices",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const f = input.callerNormalizedFemaleDomainIndices,
    m = input.callerNormalizedMaleDomainIndices;
  if (f.length !== 3 || m.length !== 3)
    simpleError(
      "domains",
      "Three independently normalized reproductive-health, empowerment, labor domain indices per category.",
    );
  [f, m].forEach((v) =>
    v.forEach((x) => {
      fraction(x, "domain");
      positive(x, "domain");
    }),
  );
  const gf = Math.cbrt(f[0] * f[1] * f[2]),
    gm = Math.cbrt(m[0] * m[1] * m[2]),
    harmonic = 2 / (1 / gf + 1 / gm),
    reference = Math.cbrt(((f[0] + m[0]) * (f[1] + m[1]) * (f[2] + m[2])) / 8);
  return { conditionalGenderInequalityIndex: 1 - harmonic / reference };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerNormalizedFemaleDomainIndices: [1, 1, 1],
    callerNormalizedMaleDomainIndices: [1, 1, 1],
  },
  output: { result: { conditionalGenderInequalityIndex: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/gender-inequality-index",
  title: "Gender Inequality Index Calculator",
  description:
    "Conditional GIIaggregation using independently established compatible three-domain indices, not raw MMR/AFRnormalization, UNDPcountry results or a universal gender-discrimination measure. Positive indices required; caller owns edition-specific transformations.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
