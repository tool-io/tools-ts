import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentElasticModulusPascals: number;
  readonly actualEffectiveSlendernessRatio: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentElasticModulusPascals",
    label: "Caller independent elastic modulus pascals",
    kind: "number",
  },
  {
    id: "actualEffectiveSlendernessRatio",
    label: "Actual effective slenderness ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerIndependentElasticModulusPascals, "E");
  positive(input.actualEffectiveSlendernessRatio, "effectiveslenderness");
  return {
    conditionalEulerCriticalStressPascals:
      (Math.PI ** 2 * input.callerIndependentElasticModulusPascals) /
      input.actualEffectiveSlendernessRatio ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentElasticModulusPascals: 100000000.0,
    actualEffectiveSlendernessRatio: 100,
  },
  output: {
    result: { conditionalEulerCriticalStressPascals: 98696.04401089357 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/slenderness-critical-stress",
  title: "Critical Slenderness Stress Calculator",
  description:
    "Ideal elastic Eulercritical stress\u03c0\u00b2E/(KL/r)\u00b2with actual independently established EFFECTIVEslenderness. Yield/inelastic branches, endconditions, imperfections and governing code external; not full buckling load or structural safety.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
