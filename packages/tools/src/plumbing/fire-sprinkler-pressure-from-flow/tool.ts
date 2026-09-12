import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSprinklerDischargeUsGpm: number;
  readonly callerVerifiedSprinklerKUsGpmPerSqrtPsi: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSprinklerDischargeUsGpm",
    label: "Actual sprinkler discharge us gpm",
    kind: "number",
  },
  {
    id: "callerVerifiedSprinklerKUsGpmPerSqrtPsi",
    label: "Caller verified sprinkler k us gpm per sqrt psi",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualSprinklerDischargeUsGpm,
    "actualSprinklerDischargeUsGpm",
  );
  positive(
    input.callerVerifiedSprinklerKUsGpmPerSqrtPsi,
    "callerVerifiedSprinklerKUsGpmPerSqrtPsi",
  );
  return {
    value:
      (input.actualSprinklerDischargeUsGpm /
        input.callerVerifiedSprinklerKUsGpmPerSqrtPsi) **
      2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSprinklerDischargeUsGpm: 20,
    callerVerifiedSprinklerKUsGpmPerSqrtPsi: 10,
  },
  output: { result: { value: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/fire-sprinkler-pressure-from-flow",
  title: "Plumbing Fire Sprinkler Pressure From Flow Calculator",
  description:
    "Inverse actual sprinkler residualPpsi=(Q/K)\u00b2, not code pressure prescription or hydraulic tree balance. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
