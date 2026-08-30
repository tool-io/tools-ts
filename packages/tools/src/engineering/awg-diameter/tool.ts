import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AwgDiameterInput = Readonly<{
  readonly awg: number;
}>;
export type AwgDiameterOutput = Readonly<{
  readonly diameterMillimeters: number;
}>;

export const calculateAwgDiameter = (
  x: AwgDiameterInput,
): AwgDiameterOutput => {
  if (!Number.isFinite(x.awg) || x.awg < -3)
    simpleError("awg", "Provide an integer from -3 (4/0 AWG) through 40.");
  if (!Number.isInteger(x.awg) || x.awg > 40)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const diameterMillimeters = 0.127 * 92 ** ((36 - x.awg) / 39);
  if (!Number.isFinite(diameterMillimeters))
    simpleError(
      "diameterMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    diameterMillimeters: Object.is(diameterMillimeters, -0)
      ? 0
      : diameterMillimeters,
  };
};

export const example = {
  input: { awg: 12 },
  output: { diameterMillimeters: 2.052525388493948 },
} satisfies ToolExample<AwgDiameterInput, AwgDiameterOutput>;

export const tool = createSimpleTool({
  id: "engineering/awg-diameter",
  title: "AWG Diameter",
  description:
    "Nominal solid conductor diameter from American Wire Gauge number, using d(in)=0.005·92^((36−AWG)/39). Use -1 for 2/0, -2 for 3/0 and -3 for 4/0 AWG; zero is 1/0.",
  inputs: [
    {
      id: "awg",
      kind: "integer",
      label: "AWG gauge",
      minimum: -3,
      maximum: 40,
    },
  ],
  outputs: [
    {
      id: "diameterMillimeters",
      kind: "number",
      label: "Diameter Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateAwgDiameter({
      awg: input.awg as number,
    }),
});
export const awgDiameterTool = tool;
export const runAwgDiameter = tool.execute;
export default tool;
