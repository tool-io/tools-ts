import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualLanthanumConcentration: number;
  readonly actualYtterbiumConcentration: number;
  readonly callerVerifiedReferenceLanthanum: number;
  readonly callerVerifiedReferenceYtterbium: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLanthanumConcentration",
    label: "Actual lanthanum concentration",
    kind: "number",
  },
  {
    id: "actualYtterbiumConcentration",
    label: "Actual ytterbium concentration",
    kind: "number",
  },
  {
    id: "callerVerifiedReferenceLanthanum",
    label: "Caller verified reference lanthanum",
    kind: "number",
  },
  {
    id: "callerVerifiedReferenceYtterbium",
    label: "Caller verified reference ytterbium",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualLanthanumConcentration, "La");
  [
    input.actualYtterbiumConcentration,
    input.callerVerifiedReferenceLanthanum,
    input.callerVerifiedReferenceYtterbium,
  ].forEach((v) => positive(v, "reference-or-Yb"));
  return {
    observedReferenceNormalizedLaYbSlope:
      input.actualLanthanumConcentration /
      input.callerVerifiedReferenceLanthanum /
      (input.actualYtterbiumConcentration /
        input.callerVerifiedReferenceYtterbium),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualLanthanumConcentration: 2,
    actualYtterbiumConcentration: 4,
    callerVerifiedReferenceLanthanum: 1,
    callerVerifiedReferenceYtterbium: 4,
  },
  output: { result: { observedReferenceNormalizedLaYbSlope: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/ree-pattern-slope-la-yb",
  title: "Geology Ree Pattern Slope La Yb Calculator",
  description:
    "Actual reference-normalized La/Ybend-member slope indicator using caller independently matched normalization source/edition; not whole REEpattern, slope-per-atomic-number or existing Eu/Ceanomaly.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
