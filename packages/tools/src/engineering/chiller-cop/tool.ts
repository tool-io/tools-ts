import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChillerCopInput = Readonly<{
  readonly coolingWatts: number;
  readonly inputWatts: number;
}>;
export type ChillerCopOutput = Readonly<{
  readonly coefficientOfPerformance: number;
}>;

export const calculateChillerCop = (x: ChillerCopInput): ChillerCopOutput => {
  if (!Number.isFinite(x.coolingWatts) || x.coolingWatts < 0)
    simpleError("coolingWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.inputWatts) || x.inputWatts < 0)
    simpleError("inputWatts", "Provide a finite number at least 0.");
  const coefficientOfPerformance = x.coolingWatts / x.inputWatts;
  if (!Number.isFinite(coefficientOfPerformance))
    simpleError(
      "coefficientOfPerformance",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    coefficientOfPerformance: Object.is(coefficientOfPerformance, -0)
      ? 0
      : coefficientOfPerformance,
  };
};

export const example = {
  input: { coolingWatts: 3000, inputWatts: 1000 },
  output: { coefficientOfPerformance: 3 },
} satisfies ToolExample<ChillerCopInput, ChillerCopOutput>;

export const tool = createSimpleTool({
  id: "engineering/chiller-cop",
  title: "Chiller Cop",
  description:
    "Chiller coefficient of performance as cooling output divided by electrical input power, in matching power units.",
  inputs: [
    {
      id: "coolingWatts",
      kind: "number",
      label: "Cooling Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "inputWatts",
      kind: "number",
      label: "Input Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coefficientOfPerformance",
      kind: "number",
      label: "Coefficient Of Performance",
    },
  ],
  calculate: (input) =>
    calculateChillerCop({
      coolingWatts: input.coolingWatts as number,
      inputWatts: input.inputWatts as number,
    }),
});
export const chillerCopTool = tool;
export const runChillerCop = tool.execute;
export default tool;
