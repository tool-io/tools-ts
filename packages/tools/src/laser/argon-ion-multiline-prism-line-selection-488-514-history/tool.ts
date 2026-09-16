import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  lines,
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
      lines:
        "Argon-ion lasers have prominent visible lines near 488 and 514.5 nm; intracavity dispersion can select lines, while device operation determines available output.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "lines" },
  output: {
    result: {
      reference:
        "Argon-ion lasers have prominent visible lines near 488 and 514.5 nm; intracavity dispersion can select lines, while device operation determines available output.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "laser/argon-ion-multiline-prism-line-selection-488-514-history",
  title: "Argon ion multiline prism line selection 488 514 history",
  description:
    "Retrieve selected argon-ion line-selection history, not an exhaustive calibrated spectrum. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
