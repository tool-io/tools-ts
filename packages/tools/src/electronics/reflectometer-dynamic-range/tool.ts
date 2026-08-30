import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReflectometerDynamicRangeInput = Readonly<{
  readonly maximumReflectedPowerW: number;
  readonly minimumDetectablePowerW: number;
}>;
export type ReflectometerDynamicRangeOutput = Readonly<{
  readonly dynamicRangeDb: number;
}>;

export const calculateReflectometerDynamicRange = (
  x: ReflectometerDynamicRangeInput,
): ReflectometerDynamicRangeOutput => {
  if (
    !Number.isFinite(x.maximumReflectedPowerW) ||
    x.maximumReflectedPowerW < 0
  )
    simpleError(
      "maximumReflectedPowerW",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.minimumDetectablePowerW) ||
    x.minimumDetectablePowerW < 0
  )
    simpleError(
      "minimumDetectablePowerW",
      "Provide a finite number at least 0.",
    );
  if (!(
    x.minimumDetectablePowerW > 0 &&
    x.maximumReflectedPowerW >= x.minimumDetectablePowerW
  ))
    simpleError(
      "input",
      "Maximum power must be at least positive minimum power.",
    );
  const dynamicRangeDb =
    10 * Math.log10(x.maximumReflectedPowerW / x.minimumDetectablePowerW);
  if (!Number.isFinite(dynamicRangeDb))
    simpleError("dynamicRangeDb", "The inputs produce an invalid result.");
  return { dynamicRangeDb: Object.is(dynamicRangeDb, -0) ? 0 : dynamicRangeDb };
};

export const example = {
  input: { maximumReflectedPowerW: 0.001, minimumDetectablePowerW: 0.000001 },
  output: { dynamicRangeDb: 30 },
} satisfies ToolExample<
  ReflectometerDynamicRangeInput,
  ReflectometerDynamicRangeOutput
>;

export const tool = createSimpleTool({
  id: "electronics/reflectometer-dynamic-range",
  title: "Reflectometer Dynamic Range",
  description:
    "Convert maximum-to-minimum detectable reflected power ratio into reflectometer dynamic range in decibels.",
  inputs: [
    {
      id: "maximumReflectedPowerW",
      kind: "number",
      label: "Maximum measurable return power",
      unit: "W",
      minimum: 0,
    },
    {
      id: "minimumDetectablePowerW",
      kind: "number",
      label: "Minimum detectable return power",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "dynamicRangeDb",
      kind: "number",
      label: "Power dynamic range",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateReflectometerDynamicRange({
      maximumReflectedPowerW: input.maximumReflectedPowerW as number,
      minimumDetectablePowerW: input.minimumDetectablePowerW as number,
    }),
});
export const reflectometerDynamicRangeTool = tool;
export const runReflectometerDynamicRange = tool.execute;
export default tool;
