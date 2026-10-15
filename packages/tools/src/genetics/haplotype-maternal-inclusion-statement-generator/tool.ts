import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{
  observedHaplotype: string;
  referenceHaplotype: string;
  comparable: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "observedHaplotype", label: "Observed haplotype", kind: "string" },
  { id: "referenceHaplotype", label: "Reference haplotype", kind: "string" },
  { id: "comparable", label: "Comparable", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  if (!i.observedHaplotype.trim() || !i.referenceHaplotype.trim())
    simpleError("haplotype", "Explicit canonical haplotype strings.");
  return {
    comparison: !i.comparable
      ? "inconclusive"
      : i.observedHaplotype === i.referenceHaplotype
        ? "not-excluded-by-supplied-haplotype"
        : "different-supplied-haplotype",
    individualIdentityEstablished: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    observedHaplotype: "A-C",
    referenceHaplotype: "A-C",
    comparable: true,
  },
  output: {
    result: {
      comparison: "not-excluded-by-supplied-haplotype",
      individualIdentityEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/haplotype-maternal-inclusion-statement-generator",
  title: "Haplotype Match Maternal Line Inclusion Statement Generator",
  description:
    "Compare independently canonicalized maternal haplotypes; shared lineage haplotypes are not individual identification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          comparison: { type: "string" },
          individualIdentityEstablished: { type: "boolean" },
        },
        required: ["comparison", "individualIdentityEstablished"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
