import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualInterpupillaryDistanceMm: number;
  readonly actualTotalVergenceAngleDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInterpupillaryDistanceMm",
    label: "Actual interpupillary distance mm",
    kind: "number",
  },
  {
    id: "actualTotalVergenceAngleDegrees",
    label: "Actual total vergence angle degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualInterpupillaryDistanceMm,
    "actualInterpupillaryDistanceMm",
  );
  positive(
    input.actualTotalVergenceAngleDegrees,
    "actualTotalVergenceAngleDegrees",
  );
  if (input.actualTotalVergenceAngleDegrees >= 180)
    simpleError("vergence", "0<θ<180°.");
  return {
    value:
      input.actualInterpupillaryDistanceMm /
      1000 /
      (2 * Math.tan((input.actualTotalVergenceAngleDegrees * Math.PI) / 360)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInterpupillaryDistanceMm: 60,
    actualTotalVergenceAngleDegrees: 90,
  },
  output: { result: { value: 0.03 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/vergence-distance",
  title: "Vergence Distance Calculator",
  description:
    "Ideal symmetric binocularvergenceintersectiondistancefromactualIPDandTOTALconvergenceangle, D=IPD/[2tan(\u03b8/2)],0<\u03b8<180\u00b0, not accommodation reciprocal.",
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
