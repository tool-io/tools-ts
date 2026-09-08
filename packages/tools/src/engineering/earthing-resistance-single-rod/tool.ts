import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerMatchedUniformSoilResistivityOhmMeters: number;
  readonly actualRodEmbeddedLengthMeters: number;
  readonly actualRodDiameterMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMatchedUniformSoilResistivityOhmMeters",
    label: "Caller matched uniform soil resistivity ohm meters",
    kind: "number",
  },
  {
    id: "actualRodEmbeddedLengthMeters",
    label: "Actual rod embedded length meters",
    kind: "number",
  },
  {
    id: "actualRodDiameterMeters",
    label: "Actual rod diameter meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerMatchedUniformSoilResistivityOhmMeters, "rho");
  positive(input.actualRodEmbeddedLengthMeters, "L");
  positive(input.actualRodDiameterMeters, "diameter");
  if (input.actualRodDiameterMeters / input.actualRodEmbeddedLengthMeters > 0.1)
    simpleError("rod", "Explicit thinrodbranch d/L≤.1.");
  return {
    conditionalSingleRodResistanceOhms:
      (input.callerMatchedUniformSoilResistivityOhmMeters /
        (2 * Math.PI * input.actualRodEmbeddedLengthMeters)) *
      (Math.log(
        (4 * input.actualRodEmbeddedLengthMeters) /
          input.actualRodDiameterMeters,
      ) -
        1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMatchedUniformSoilResistivityOhmMeters: 100,
    actualRodEmbeddedLengthMeters: 2,
    actualRodDiameterMeters: 0.02,
  },
  output: {
    result: { conditionalSingleRodResistanceOhms: 39.720812797009195 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/earthing-resistance-single-rod",
  title: "Single-Rod Earthing Resistance Calculator",
  description:
    "Declared thin vertical groundrod homogeneous-halfspace approximation\u03c1/(2\u03c0L)[ln(4L/d)\u22121], diameter d, embedded L, d/L\u2264.1. Not layered ground, bonding/step touch limits, multiple rods, electrical-code compliance or safe earthing approval.",
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
