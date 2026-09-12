import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualCertifiedFrobeniusConjugacyClassSize: number;
  readonly actualCertifiedFiniteGaloisGroupOrder: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCertifiedFrobeniusConjugacyClassSize",
    label: "Actual certified frobenius conjugacy class size",
    kind: "number",
  },
  {
    id: "actualCertifiedFiniteGaloisGroupOrder",
    label: "Actual certified finite galois group order",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualCertifiedFrobeniusConjugacyClassSize,
    "actualCertifiedFrobeniusConjugacyClassSize",
    1,
    1000000,
  );
  bounded(
    input.actualCertifiedFiniteGaloisGroupOrder,
    "actualCertifiedFiniteGaloisGroupOrder",
    1,
    1000000,
  );
  if (
    input.actualCertifiedFrobeniusConjugacyClassSize >
      input.actualCertifiedFiniteGaloisGroupOrder ||
    input.actualCertifiedFiniteGaloisGroupOrder %
      input.actualCertifiedFrobeniusConjugacyClassSize
  )
    simpleError("class", "Actual class size positive divisor of group order.");
  return {
    value:
      input.actualCertifiedFrobeniusConjugacyClassSize /
      input.actualCertifiedFiniteGaloisGroupOrder,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCertifiedFrobeniusConjugacyClassSize: 2,
    actualCertifiedFiniteGaloisGroupOrder: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/chebotarev-density",
  title: "Chebotarev Density Calculator",
  description:
    "Chebotarev theorem conditional conjugacy class density|C|/|G|for independently certifiedfiniteGaloisextension/classunramifiedprimes; not certify extension/group or approximate finite prime count.",
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
