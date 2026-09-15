import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  countFraction,
} from "../batch53-shared.js";

export type Input = Readonly<{
  duplicatedComplete: number;
  fragmented: number;
  totalOrthologs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "duplicatedComplete", label: "Duplicated complete", kind: "number" },
  { id: "fragmented", label: "Fragmented", kind: "number" },
  { id: "totalOrthologs", label: "Total orthologs", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  countFraction(i.duplicatedComplete, i.totalOrthologs);
  countFraction(i.fragmented, i.totalOrthologs);
  if (i.duplicatedComplete + i.fragmented > i.totalOrthologs)
    simpleError("counts", "Disjoint categories within total.");
  return {
    duplicationCaveat: i.duplicatedComplete > 0,
    fragmentationCaveat: i.fragmented > 0,
    completenessAloneEstablishesAssemblyQuality: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { duplicatedComplete: 1, fragmented: 2, totalOrthologs: 10 },
  output: {
    result: {
      duplicationCaveat: true,
      fragmentationCaveat: true,
      completenessAloneEstablishesAssemblyQuality: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/completeness-duplication-caveat-flag-checker",
  title: "Duplicated Fragmentation Warning Completeness Caveat Flag Checker",
  description:
    "Flag supplied complete-duplicated and fragmented ortholog evidence; not a BUSCO run or proof of contamination/assembly failure.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
