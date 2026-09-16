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
      history:
        "The Boeing YAL-1 Airborne Laser was a modified 747 chemical oxygen-iodine laser missile-defense demonstrator; the program was terminated, not deployed as an operational fleet.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "history" },
  output: {
    result: {
      reference:
        "The Boeing YAL-1 Airborne Laser was a modified 747 chemical oxygen-iodine laser missile-defense demonstrator; the program was terminated, not deployed as an operational fleet.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "laser/airborne-laser-abl-boeing-megawatt-mission-history-lookup",
  title: "Airborne laser ABL boeing megawatt mission history lookup",
  description:
    "Retrieve the bounded airborne-laser demonstrator history. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
