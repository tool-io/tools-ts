import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  expFinite,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedKaneA: number;
  readonly callerCalibratedKaneBVoltsPerMeter: number;
  readonly callerCalibratedFieldExponent: number;
  readonly actualElectricFieldVoltsPerMeter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedKaneA",
    label: "Caller calibrated kane a",
    kind: "number",
  },
  {
    id: "callerCalibratedKaneBVoltsPerMeter",
    label: "Caller calibrated kane b volts per meter",
    kind: "number",
  },
  {
    id: "callerCalibratedFieldExponent",
    label: "Caller calibrated field exponent",
    kind: "number",
  },
  {
    id: "actualElectricFieldVoltsPerMeter",
    label: "Actual electric field volts per meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerCalibratedKaneA, "A");
  positive(input.callerCalibratedKaneBVoltsPerMeter, "B");
  positive(input.callerCalibratedFieldExponent, "p");
  positive(input.actualElectricFieldVoltsPerMeter, "field");
  return {
    conditionalBtbtGenerationRate:
      input.callerCalibratedKaneA *
      input.actualElectricFieldVoltsPerMeter **
        input.callerCalibratedFieldExponent *
      expFinite(
        -input.callerCalibratedKaneBVoltsPerMeter /
          input.actualElectricFieldVoltsPerMeter,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedKaneA: 2,
    callerCalibratedKaneBVoltsPerMeter: 1,
    callerCalibratedFieldExponent: 2,
    actualElectricFieldVoltsPerMeter: 1,
  },
  output: { result: { conditionalBtbtGenerationRate: 0.7357588823428847 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/btbt-generation-rate-kane",
  title: "Semiconductor Btbt Generation Rate Kane Calculator",
  description:
    "Explicit calibrated KaneA E^pexp(\u2212B/E) generation-rate model with independently established coefficient units/material branch. Not existing Eexpcurrent prefactor, trap process, universal direct/indirect exponent or breakdown simulation.",
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
