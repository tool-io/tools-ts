import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, exactLookup } from "../batch53-shared.js";

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
      PRK: "Surface corneal ablation; no LASIK flap.",
      LASIK: "A corneal flap is created before stromal excimer ablation.",
      SMILE:
        "A femtosecond-created lenticule is removed through a small incision; not an excimer ablation procedure.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "PRK" },
  output: { result: { reference: "Surface corneal ablation; no LASIK flap." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "laser/prk-lasik-smile-flapless-procedure-compare-lookup",
  title: "Prk Lasik Smile Flapless Procedure Compare Lookup",
  description:
    "Compare laser refractive-surgery mechanisms only; no patient selection or treatment settings. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
