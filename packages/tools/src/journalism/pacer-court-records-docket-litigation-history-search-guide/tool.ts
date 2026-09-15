import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  records,
  exactLookup,
} from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    reference: exactLookup(i.key, {
      guide:
        "PACER provides US federal court electronic case records. Search the correct court and identifiers, inspect docket context, note access restrictions and fees, and corroborate identities; docket presence is not proof of wrongdoing.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "guide" },
  output: {
    result: {
      reference:
        "PACER provides US federal court electronic case records. Search the correct court and identifiers, inspect docket context, note access restrictions and fees, and corroborate identities; docket presence is not proof of wrongdoing.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/pacer-court-records-docket-litigation-history-search-guide",
  title: "PACER Court Records Docket Litigation History Search Guide",
  description:
    "Retrieve a bounded court-record research guide; no live docket search. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
