import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerDesignEstablishedShearReinforcementAreaSquareMeters: number;
  readonly callerDesignEstablishedSteelDesignStressPascals: number;
  readonly callerDesignEstablishedEffectiveDepthMeters: number;
  readonly callerDesignEstablishedRequiredReinforcementShearNewtons: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerDesignEstablishedShearReinforcementAreaSquareMeters",
    label: "Caller design established shear reinforcement area square meters",
    kind: "number",
  },
  {
    id: "callerDesignEstablishedSteelDesignStressPascals",
    label: "Caller design established steel design stress pascals",
    kind: "number",
  },
  {
    id: "callerDesignEstablishedEffectiveDepthMeters",
    label: "Caller design established effective depth meters",
    kind: "number",
  },
  {
    id: "callerDesignEstablishedRequiredReinforcementShearNewtons",
    label: "Caller design established required reinforcement shear newtons",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerDesignEstablishedShearReinforcementAreaSquareMeters,
    input.callerDesignEstablishedSteelDesignStressPascals,
    input.callerDesignEstablishedEffectiveDepthMeters,
    input.callerDesignEstablishedRequiredReinforcementShearNewtons,
  ].forEach((v) => positive(v, "independentdesignquantity"));
  return {
    conditionalIdealRequiredSpacingMeters:
      (input.callerDesignEstablishedShearReinforcementAreaSquareMeters *
        input.callerDesignEstablishedSteelDesignStressPascals *
        input.callerDesignEstablishedEffectiveDepthMeters) /
      input.callerDesignEstablishedRequiredReinforcementShearNewtons,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerDesignEstablishedShearReinforcementAreaSquareMeters: 0.001,
    callerDesignEstablishedSteelDesignStressPascals: 100000000.0,
    callerDesignEstablishedEffectiveDepthMeters: 0.5,
    callerDesignEstablishedRequiredReinforcementShearNewtons: 100000.0,
  },
  output: { result: { conditionalIdealRequiredSpacingMeters: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/stirrup-spacing-required",
  title: "Required Stirrup Spacing Calculator",
  description:
    "Explicit ideal shearVs=Avfyd/srearrangement only, all actual governing design quantities independently engineer-established. Not construction equal stirrup-count spacing, design-code factors, min/max spacing, concrete contribution or safety approval.",
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
