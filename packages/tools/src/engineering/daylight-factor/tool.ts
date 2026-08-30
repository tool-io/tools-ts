import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DaylightFactorInput = Readonly<{
  readonly indoorLux: number;
  readonly outdoorLux: number;
}>;
export type DaylightFactorOutput = Readonly<{
  readonly daylightFactorPercent: number;
}>;

export const calculateDaylightFactor = (
  x: DaylightFactorInput,
): DaylightFactorOutput => {
  if (!Number.isFinite(x.indoorLux) || x.indoorLux < 0)
    simpleError("indoorLux", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.outdoorLux) || x.outdoorLux < 0)
    simpleError("outdoorLux", "Provide a finite number at least 0.");
  const daylightFactorPercent = (100 * x.indoorLux) / x.outdoorLux;
  if (!Number.isFinite(daylightFactorPercent))
    simpleError(
      "daylightFactorPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    daylightFactorPercent: Object.is(daylightFactorPercent, -0)
      ? 0
      : daylightFactorPercent,
  };
};

export const example = {
  input: { indoorLux: 300, outdoorLux: 10000 },
  output: { daylightFactorPercent: 3 },
} satisfies ToolExample<DaylightFactorInput, DaylightFactorOutput>;

export const tool = createSimpleTool({
  id: "engineering/daylight-factor",
  title: "Daylight Factor",
  description:
    "Daylight factor as indoor daylight illuminance divided by simultaneous unobstructed outdoor illuminance, in percent.",
  inputs: [
    {
      id: "indoorLux",
      kind: "number",
      label: "Indoor Lux",
      unit: "lx",
      minimum: 0,
    },
    {
      id: "outdoorLux",
      kind: "number",
      label: "Outdoor Lux",
      unit: "lx",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "daylightFactorPercent",
      kind: "number",
      label: "Daylight Factor Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateDaylightFactor({
      indoorLux: input.indoorLux as number,
      outdoorLux: input.outdoorLux as number,
    }),
});
export const daylightFactorTool = tool;
export const runDaylightFactor = tool.execute;
export default tool;
