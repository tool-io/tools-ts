import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualLegLengthsMeters: readonly number[];
  readonly actualLegInclinationsDegrees: readonly number[];
  readonly independentlyAssignedExtendDirectionSigns: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLegLengthsMeters",
    label: "Actual leg lengths meters",
    kind: "numberList",
  },
  {
    id: "actualLegInclinationsDegrees",
    label: "Actual leg inclinations degrees",
    kind: "numberList",
  },
  {
    id: "independentlyAssignedExtendDirectionSigns",
    label: "Independently assigned extend direction signs",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualLegLengthsMeters,
    input.actualLegInclinationsDegrees,
    "legs",
  );
  aligned(
    input.actualLegLengthsMeters,
    input.independentlyAssignedExtendDirectionSigns,
    "signs",
  );
  input.actualLegLengthsMeters.forEach((v) => nonnegative(v, "length"));
  if (
    input.actualLegInclinationsDegrees.some((v) => Math.abs(v) > 90) ||
    input.independentlyAssignedExtendDirectionSigns.some(
      (v) => v !== 1 && v !== -1,
    )
  )
    simpleError(
      "legs",
      "Actual inclinations±90and independently assigned±1extend directions.",
    );
  return {
    signedExtendedElevationHorizontalCoordinateMeters: sum(
      input.actualLegLengthsMeters.map(
        (v, i) =>
          v *
          Math.cos((input.actualLegInclinationsDegrees[i] * Math.PI) / 180) *
          input.independentlyAssignedExtendDirectionSigns[i],
      ),
    ),
    signedExtendedElevationVerticalCoordinateMeters: sum(
      input.actualLegLengthsMeters.map(
        (v, i) =>
          v * Math.sin((input.actualLegInclinationsDegrees[i] * Math.PI) / 180),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualLegLengthsMeters: [2, 3],
    actualLegInclinationsDegrees: [0, 0],
    independentlyAssignedExtendDirectionSigns: [1, -1],
  },
  output: {
    result: {
      signedExtendedElevationHorizontalCoordinateMeters: -1,
      signedExtendedElevationVerticalCoordinateMeters: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/extended-elevation-length",
  title: "Extended Elevation Projection Length Calculator",
  description:
    "Declared unfolded extended-elevation cumulative horizontal coordinate with independently chosen\u00b11extend flags, and signed vertical coordinate. Not global planprojection, selfintersection correction or survey network adjustment.",
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
