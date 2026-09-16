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
      legacy:
        "PbS/PbSe lead-salt diode lasers are historical tunable mid-infrared sources commonly requiring cooling; wavelength and operating temperature are device-specific.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "legacy" },
  output: {
    result: {
      reference:
        "PbS/PbSe lead-salt diode lasers are historical tunable mid-infrared sources commonly requiring cooling; wavelength and operating temperature are device-specific.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "laser/lead-salt-pbs-pbse-cryocooled-legacy-mid-ir-diode-history-lookup",
  title: "Lead salt PBS PBSE cryocooled legacy mid ir diode history lookup",
  description:
    "Retrieve the lead-salt diode history context. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
