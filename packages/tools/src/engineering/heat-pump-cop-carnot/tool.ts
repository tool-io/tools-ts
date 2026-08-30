import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeatPumpCopCarnotInput = Readonly<{
  readonly hotKelvin: number;
  readonly coldKelvin: number;
}>;
export type HeatPumpCopCarnotOutput = Readonly<{
  readonly heatingCop: number;
}>;

export const calculateHeatPumpCopCarnot = (
  x: HeatPumpCopCarnotInput,
): HeatPumpCopCarnotOutput => {
  if (!Number.isFinite(x.hotKelvin) || x.hotKelvin < 0)
    simpleError("hotKelvin", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.coldKelvin) || x.coldKelvin < 0)
    simpleError("coldKelvin", "Provide a finite number at least 0.");
  if (x.hotKelvin <= x.coldKelvin)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const heatingCop = x.hotKelvin / (x.hotKelvin - x.coldKelvin);
  if (!Number.isFinite(heatingCop))
    simpleError(
      "heatingCop",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { heatingCop: Object.is(heatingCop, -0) ? 0 : heatingCop };
};

export const example = {
  input: { hotKelvin: 300, coldKelvin: 280 },
  output: { heatingCop: 15 },
} satisfies ToolExample<HeatPumpCopCarnotInput, HeatPumpCopCarnotOutput>;

export const tool = createSimpleTool({
  id: "engineering/heat-pump-cop-carnot",
  title: "Heat Pump Cop Carnot",
  description:
    "Theoretical maximum heating COP of a reversible heat pump, Th/(Th−Tc), using absolute hot and cold reservoir temperatures.",
  inputs: [
    {
      id: "hotKelvin",
      kind: "number",
      label: "Hot Kelvin",
      unit: "K",
      minimum: 0,
    },
    {
      id: "coldKelvin",
      kind: "number",
      label: "Cold Kelvin",
      unit: "K",
      minimum: 0,
    },
  ],
  outputs: [{ id: "heatingCop", kind: "number", label: "Heating Cop" }],
  calculate: (input) =>
    calculateHeatPumpCopCarnot({
      hotKelvin: input.hotKelvin as number,
      coldKelvin: input.coldKelvin as number,
    }),
});
export const heatPumpCopCarnotTool = tool;
export const runHeatPumpCopCarnot = tool.execute;
export default tool;
