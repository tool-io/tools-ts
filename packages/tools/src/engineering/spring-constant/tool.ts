import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpringConstantInput = Readonly<{
  readonly forceChangeNewtons: number;
  readonly deflectionChangeMeters: number;
}>;
export type SpringConstantOutput = Readonly<{
  readonly newtonsPerMeter: number;
}>;

export const calculateSpringConstant = (
  x: SpringConstantInput,
): SpringConstantOutput => {
  if (!Number.isFinite(x.forceChangeNewtons))
    simpleError("forceChangeNewtons", "Provide a finite number.");
  if (!Number.isFinite(x.deflectionChangeMeters))
    simpleError("deflectionChangeMeters", "Provide a finite number.");
  const newtonsPerMeter = x.forceChangeNewtons / x.deflectionChangeMeters;
  if (!Number.isFinite(newtonsPerMeter))
    simpleError(
      "newtonsPerMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    newtonsPerMeter: Object.is(newtonsPerMeter, -0) ? 0 : newtonsPerMeter,
  };
};

export const example = {
  input: { forceChangeNewtons: 100, deflectionChangeMeters: 0.01 },
  output: { newtonsPerMeter: 10000 },
} satisfies ToolExample<SpringConstantInput, SpringConstantOutput>;

export const tool = createSimpleTool({
  id: "engineering/spring-constant",
  title: "Spring Constant",
  description:
    "Linear spring stiffness from measured force change divided by deflection change within the spring’s elastic operating range.",
  inputs: [
    {
      id: "forceChangeNewtons",
      kind: "number",
      label: "Force Change Newtons",
      unit: "N",
    },
    {
      id: "deflectionChangeMeters",
      kind: "number",
      label: "Deflection Change Meters",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "newtonsPerMeter",
      kind: "number",
      label: "Newtons Per Meter",
      unit: "N/m",
    },
  ],
  calculate: (input) =>
    calculateSpringConstant({
      forceChangeNewtons: input.forceChangeNewtons as number,
      deflectionChangeMeters: input.deflectionChangeMeters as number,
    }),
});
export const springConstantTool = tool;
export const runSpringConstant = tool.execute;
export default tool;
