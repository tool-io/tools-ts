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
      facility:
        "LCLS at SLAC is an X-ray free-electron laser facility. Wavelength range, pulse structure and instrument access depend on the separately qualified operating mode and date.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "facility" },
  output: {
    result: {
      reference:
        "LCLS at SLAC is an X-ray free-electron laser facility. Wavelength range, pulse structure and instrument access depend on the separately qualified operating mode and date.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "laser/lcls-linac-coherent-light-source-angstrom-imaging-class-lookup",
  title: "LCLS Linac Coherent Light Source Angstrom Imaging Class Lookup",
  description:
    "Retrieve the LCLS facility class without inventing beamtime or current operating settings. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
