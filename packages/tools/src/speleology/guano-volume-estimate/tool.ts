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
  readonly actualGuanoPileEllipticalBaseSemiaxesMeters: readonly number[];
  readonly actualGuanoPileHeightMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualGuanoPileEllipticalBaseSemiaxesMeters",
    label: "Actual guano pile elliptical base semiaxes meters",
    kind: "numberList",
  },
  {
    id: "actualGuanoPileHeightMeters",
    label: "Actual guano pile height meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.actualGuanoPileEllipticalBaseSemiaxesMeters.length !== 2)
    simpleError("base", "Two independently measured semiaxes.");
  input.actualGuanoPileEllipticalBaseSemiaxesMeters.forEach((v) =>
    positive(v, "axis"),
  );
  nonnegative(input.actualGuanoPileHeightMeters, "height");
  return {
    conditionalEllipticalConeGuanoVolumeCubicMeters:
      (Math.PI *
        input.actualGuanoPileEllipticalBaseSemiaxesMeters[0] *
        input.actualGuanoPileEllipticalBaseSemiaxesMeters[1] *
        input.actualGuanoPileHeightMeters) /
      3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualGuanoPileEllipticalBaseSemiaxesMeters: [2, 3],
    actualGuanoPileHeightMeters: 1,
  },
  output: {
    result: {
      conditionalEllipticalConeGuanoVolumeCubicMeters: 6.283185307179586,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/guano-volume-estimate",
  title: "Bat Guano Pile Volume Estimate Calculator",
  description:
    "Conditional elliptical CONEguano geometry, actual basal semiaxesandheight; not halfellipsoid, true irregular pilevolume or sampling/handling permission.",
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
