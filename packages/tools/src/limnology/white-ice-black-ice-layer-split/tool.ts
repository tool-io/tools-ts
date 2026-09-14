import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualWhiteIceThicknessMeters: number;
  readonly actualBlackIceThicknessMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualWhiteIceThicknessMeters",
    label: "Actual white ice thickness meters",
    kind: "number",
  },
  {
    id: "actualBlackIceThicknessMeters",
    label: "Actual black ice thickness meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualWhiteIceThicknessMeters, "white");
  nonnegative(input.actualBlackIceThicknessMeters, "black");
  const t = positive(
    input.actualWhiteIceThicknessMeters + input.actualBlackIceThicknessMeters,
    "total",
  );
  return {
    totalIceThicknessMeters: t,
    whiteIceFraction: input.actualWhiteIceThicknessMeters / t,
    blackIceFraction: input.actualBlackIceThicknessMeters / t,
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
    actualWhiteIceThicknessMeters: 0.2,
    actualBlackIceThicknessMeters: 0.8,
  },
  output: {
    result: {
      totalIceThicknessMeters: 1,
      whiteIceFraction: 0.2,
      blackIceFraction: 0.8,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/white-ice-black-ice-layer-split",
  title: "White Ice Black Ice Layer Split Calculator",
  description:
    "Observedtwo-layerwhite/blackicethicknessfractions,not inferbearingcapacityor safeice travel. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
