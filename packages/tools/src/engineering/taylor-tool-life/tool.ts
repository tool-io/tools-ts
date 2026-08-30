import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TaylorToolLifeInput = Readonly<{
  readonly taylorConstantMetersPerMinute: number;
  readonly cuttingSpeedMetersPerMinute: number;
  readonly taylorExponent: number;
}>;
export type TaylorToolLifeOutput = Readonly<{
  readonly lifeMinutes: number;
}>;

export const calculateTaylorToolLife = (
  x: TaylorToolLifeInput,
): TaylorToolLifeOutput => {
  if (
    !Number.isFinite(x.taylorConstantMetersPerMinute) ||
    x.taylorConstantMetersPerMinute < 0
  )
    simpleError(
      "taylorConstantMetersPerMinute",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.cuttingSpeedMetersPerMinute) ||
    x.cuttingSpeedMetersPerMinute < 0
  )
    simpleError(
      "cuttingSpeedMetersPerMinute",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.taylorExponent) || x.taylorExponent < 0)
    simpleError("taylorExponent", "Provide a finite number at least 0.");
  const lifeMinutes =
    (x.taylorConstantMetersPerMinute / x.cuttingSpeedMetersPerMinute) **
    (1 / x.taylorExponent);
  if (!Number.isFinite(lifeMinutes))
    simpleError(
      "lifeMinutes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lifeMinutes: Object.is(lifeMinutes, -0) ? 0 : lifeMinutes };
};

export const example = {
  input: {
    taylorConstantMetersPerMinute: 300,
    cuttingSpeedMetersPerMinute: 150,
    taylorExponent: 0.25,
  },
  output: { lifeMinutes: 16 },
} satisfies ToolExample<TaylorToolLifeInput, TaylorToolLifeOutput>;

export const tool = createSimpleTool({
  id: "engineering/taylor-tool-life",
  title: "Taylor Tool Life",
  description:
    "Taylor machining tool life T=(C/V)^(1/n) for empirical constant C and exponent n calibrated to the same speed units.",
  inputs: [
    {
      id: "taylorConstantMetersPerMinute",
      kind: "number",
      label: "Taylor Constant Meters Per Minute",
      unit: "m/min",
      minimum: 0,
    },
    {
      id: "cuttingSpeedMetersPerMinute",
      kind: "number",
      label: "Cutting Speed Meters Per Minute",
      unit: "m/min",
      minimum: 0,
    },
    {
      id: "taylorExponent",
      kind: "number",
      label: "Taylor Exponent",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lifeMinutes", kind: "number", label: "Life Minutes", unit: "min" },
  ],
  calculate: (input) =>
    calculateTaylorToolLife({
      taylorConstantMetersPerMinute:
        input.taylorConstantMetersPerMinute as number,
      cuttingSpeedMetersPerMinute: input.cuttingSpeedMetersPerMinute as number,
      taylorExponent: input.taylorExponent as number,
    }),
});
export const taylorToolLifeTool = tool;
export const runTaylorToolLife = tool.execute;
export default tool;
