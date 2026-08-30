import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FdmPrintingTimeInput = Readonly<{
  readonly depositedCubicMillimeters: number;
  readonly depositionCubicMillimetersPerMinute: number;
}>;
export type FdmPrintingTimeOutput = Readonly<{
  readonly timeMinutes: number;
}>;

export const calculateFdmPrintingTime = (
  x: FdmPrintingTimeInput,
): FdmPrintingTimeOutput => {
  if (
    !Number.isFinite(x.depositedCubicMillimeters) ||
    x.depositedCubicMillimeters < 0
  )
    simpleError(
      "depositedCubicMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.depositionCubicMillimetersPerMinute) ||
    x.depositionCubicMillimetersPerMinute < 0
  )
    simpleError(
      "depositionCubicMillimetersPerMinute",
      "Provide a finite number at least 0.",
    );
  const timeMinutes =
    x.depositedCubicMillimeters / x.depositionCubicMillimetersPerMinute;
  if (!Number.isFinite(timeMinutes))
    simpleError(
      "timeMinutes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { timeMinutes: Object.is(timeMinutes, -0) ? 0 : timeMinutes };
};

export const example = {
  input: {
    depositedCubicMillimeters: 10000,
    depositionCubicMillimetersPerMinute: 100,
  },
  output: { timeMinutes: 100 },
} satisfies ToolExample<FdmPrintingTimeInput, FdmPrintingTimeOutput>;

export const tool = createSimpleTool({
  id: "engineering/fdm-printing-time",
  title: "FDM Printing Time",
  description:
    "Ideal FDM extrusion time from deposited volume and volumetric deposition rate; excludes travel, heating and pauses.",
  inputs: [
    {
      id: "depositedCubicMillimeters",
      kind: "number",
      label: "Deposited Cubic Millimeters",
      unit: "mm³",
      minimum: 0,
    },
    {
      id: "depositionCubicMillimetersPerMinute",
      kind: "number",
      label: "Deposition Cubic Millimeters Per Minute",
      unit: "mm³/min",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "timeMinutes", kind: "number", label: "Time Minutes", unit: "min" },
  ],
  calculate: (input) =>
    calculateFdmPrintingTime({
      depositedCubicMillimeters: input.depositedCubicMillimeters as number,
      depositionCubicMillimetersPerMinute:
        input.depositionCubicMillimetersPerMinute as number,
    }),
});
export const fdmPrintingTimeTool = tool;
export const runFdmPrintingTime = tool.execute;
export default tool;
