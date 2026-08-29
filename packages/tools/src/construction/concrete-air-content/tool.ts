import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteAirContentInput = Readonly<{
  readonly airVolumeCubicMeters: number;
  readonly totalConcreteVolumeCubicMeters: number;
}>;
export type ConcreteAirContentOutput = Readonly<{ airContentPercent: number }>;

export const calculateConcreteAirContent = (
  i: ConcreteAirContentInput,
): ConcreteAirContentOutput => {
  if (i.airVolumeCubicMeters > i.totalConcreteVolumeCubicMeters)
    simpleError(
      "airVolumeCubicMeters",
      "Air volume cannot exceed total concrete volume.",
    );
  const value =
    (100 * i.airVolumeCubicMeters) / i.totalConcreteVolumeCubicMeters;
  if (!Number.isFinite(value))
    simpleError("airContentPercent", "The inputs produce a non-finite result.");
  return { airContentPercent: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { airVolumeCubicMeters: 0.05, totalConcreteVolumeCubicMeters: 1 },
  output: { airContentPercent: 5 },
} satisfies ToolExample<ConcreteAirContentInput, ConcreteAirContentOutput>;

export const tool = createSimpleTool({
  id: "construction/concrete-air-content",
  title: "Concrete Air Content",
  description:
    "Calculate entrained-air content as the air-volume percentage of total fresh-concrete volume.",
  inputs: [
    {
      id: "airVolumeCubicMeters",
      kind: "number",
      label: "Air Volume (m³)",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "totalConcreteVolumeCubicMeters",
      kind: "number",
      label: "Total Concrete Volume (m³)",
      unit: "m³",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "airContentPercent",
      kind: "number",
      label: "Air Content (%)",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateConcreteAirContent({
      airVolumeCubicMeters: input.airVolumeCubicMeters as number,
      totalConcreteVolumeCubicMeters:
        input.totalConcreteVolumeCubicMeters as number,
    }),
});
export const concreteAirContentTool = tool;
export const runConcreteAirContent = tool.execute;
export default tool;
