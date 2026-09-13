import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualHeadsetTotalWeightForceNewtons: number;
  readonly actualHeadsetCenterOfMassSupportFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHeadsetTotalWeightForceNewtons",
    label: "Actual headset total weight force new tons",
    kind: "number",
  },
  {
    id: "actualHeadsetCenterOfMassSupportFraction",
    label: "Actual headset center of mass support fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualHeadsetTotalWeightForceNewtons,
    "actualHeadsetTotalWeightForceNewtons",
  );
  fraction(
    input.actualHeadsetCenterOfMassSupportFraction,
    "actualHeadsetCenterOfMassSupportFraction",
  );
  return {
    value:
      input.actualHeadsetTotalWeightForceNewtons *
      input.actualHeadsetCenterOfMassSupportFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualHeadsetTotalWeightForceNewtons: 10,
    actualHeadsetCenterOfMassSupportFraction: 0.5,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/weight-distribution-headset",
  title: "Headset Weight Distribution Calculator",
  description:
    "Restricted two static-support vertical reaction load on front contact W\u00d7independently measured COM lever arm/span fraction, actual fraction in[0,1]. Not bilateral pressure/strap tension or inferred fit comfort.",
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
