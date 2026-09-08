import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerValidatedMembraneCriticalTensionNewtonsPerMeter: number;
  readonly callerVerifiedInsideMinusOutsideOsmoticPressurePascals: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerValidatedMembraneCriticalTensionNewtonsPerMeter",
    label: "Caller validated membrane critical tension newtons per meter",
    kind: "number",
  },
  {
    id: "callerVerifiedInsideMinusOutsideOsmoticPressurePascals",
    label: "Caller verified inside minus outside osmotic pressure pascals",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerValidatedMembraneCriticalTensionNewtonsPerMeter,
    "tension",
  );
  positive(
    input.callerVerifiedInsideMinusOutsideOsmoticPressurePascals,
    "pressure",
  );
  return {
    conditionalLaplaceCriticalRadiusMeters:
      (2 * input.callerValidatedMembraneCriticalTensionNewtonsPerMeter) /
      input.callerVerifiedInsideMinusOutsideOsmoticPressurePascals,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerValidatedMembraneCriticalTensionNewtonsPerMeter: 0.01,
    callerVerifiedInsideMinusOutsideOsmoticPressurePascals: 100,
  },
  output: { result: { conditionalLaplaceCriticalRadiusMeters: 0.0002 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/protocell-osmotic-rupture-radius-bound",
  title: "Protocell Division Osmotic Pressure Rupture Radius Bound Calculator",
  description:
    "Ideal spherical membrane Laplace critical radius2\u03b3/\u0394Punder independently validated tension and positive outward pressure. No bending, active transport, division dynamics, actual rupture certainty or origin-of-life proof.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
