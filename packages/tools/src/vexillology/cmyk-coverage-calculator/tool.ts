import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  fraction,
  sum,
  aligned,
  shape,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualNonoverlappingPatchAreasCm2: readonly number[];
  readonly callerActualMatchedCmykFractions: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNonoverlappingPatchAreasCm2",
    label: "Actual nonoverlapping patch areas cm2",
    kind: "numberList",
  },
  {
    id: "callerActualMatchedCmykFractions",
    label: "Caller actual matched cmyk fractions",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualNonoverlappingPatchAreasCm2,
    input.callerActualMatchedCmykFractions,
    "patches",
  );
  input.actualNonoverlappingPatchAreasCm2.forEach((v) =>
    nonnegative(v, "area"),
  );
  if (shape(input.callerActualMatchedCmykFractions, "CMYK") !== 4)
    simpleError("CMYK", "Actualfour-channelmatchedpatchrows.");
  input.callerActualMatchedCmykFractions
    .flat()
    .forEach((v) => fraction(v, "fraction"));
  return {
    equivalentFullToneChannelAreasCm2: [0, 1, 2, 3].map((c) =>
      sum(
        input.actualNonoverlappingPatchAreasCm2.map(
          (v, i) => v * input.callerActualMatchedCmykFractions[i][c],
        ),
      ),
    ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualNonoverlappingPatchAreasCm2: [10, 20],
    callerActualMatchedCmykFractions: [
      [1, 0, 0, 0],
      [0, 0.5, 0, 1],
    ],
  },
  output: { result: { equivalentFullToneChannelAreasCm2: [10, 10, 0, 20] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/cmyk-coverage-calculator",
  title: "CMYK Print Coverage per Color Calculator",
  description:
    "Actualdisjointprintedpatchchannelarea\u03a3A\u00d7CMYKfraction,not sumCMYKpercentTACor ink-volume/materialpressreadiness. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
