import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  record,
  exactLookup,
} from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    reference: exactLookup(i.key, {
      "0": "No assertion criteria, no assertion, or conflicting categories depend on the separately supplied ClinVar review-status record; star count alone is insufficient.",
      "1": "Criteria provided, single submitter or conflicting interpretations depending on review status.",
      "2": "Criteria provided, multiple submitters, no conflicts.",
      "3": "Reviewed by expert panel.",
      "4": "Practice guideline.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "0" },
  output: {
    result: {
      reference:
        "No assertion criteria, no assertion, or conflicting categories depend on the separately supplied ClinVar review-status record; star count alone is insufficient.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/clinvar-star-rating-mapper",
  title: "ClinVar Clinical Significance Star Rating Mapper",
  description:
    "Decode ClinVar review stars, not clinical significance or a live database lookup. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
