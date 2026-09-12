import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualRainIntensityMetersPerSecond: number;
  readonly actualContributingRoofAreaSquareMeters: number;
  readonly callerCalibratedRoofRunoffFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRainIntensityMetersPerSecond",
    label: "Actual rain intensity meters per second",
    kind: "number",
  },
  {
    id: "actualContributingRoofAreaSquareMeters",
    label: "Actual contributing roof area square meters",
    kind: "number",
  },
  {
    id: "callerCalibratedRoofRunoffFraction",
    label: "Caller calibrated roof runoff fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualRainIntensityMetersPerSecond,
    "actualRainIntensityMetersPerSecond",
  );
  nonnegative(
    input.actualContributingRoofAreaSquareMeters,
    "actualContributingRoofAreaSquareMeters",
  );
  fraction(
    input.callerCalibratedRoofRunoffFraction,
    "callerCalibratedRoofRunoffFraction",
  );
  return {
    value:
      input.actualRainIntensityMetersPerSecond *
      input.actualContributingRoofAreaSquareMeters *
      input.callerCalibratedRoofRunoffFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRainIntensityMetersPerSecond: 1,
    actualContributingRoofAreaSquareMeters: 10,
    callerCalibratedRoofRunoffFraction: 0.5,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/roof-drain-flow-rate",
  title: "Plumbing Roof Drain Flow Rate Calculator",
  description:
    "Actual independently governing rain intensity\u00d7roof area\u00d7runoff fraction roofinflowm\u00b3/s, no drain capacity/code-rain period selected. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
