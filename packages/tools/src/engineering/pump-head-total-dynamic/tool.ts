import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PumpHeadTotalDynamicInput = Readonly<{
  readonly staticLiftMeters: number;
  readonly frictionHeadMeters: number;
  readonly pressureHeadMeters: number;
  readonly velocityHeadMeters: number;
}>;
export type PumpHeadTotalDynamicOutput = Readonly<{
  readonly totalHeadMeters: number;
}>;

export const calculatePumpHeadTotalDynamic = (
  x: PumpHeadTotalDynamicInput,
): PumpHeadTotalDynamicOutput => {
  if (!Number.isFinite(x.staticLiftMeters))
    simpleError("staticLiftMeters", "Provide a finite number.");
  if (!Number.isFinite(x.frictionHeadMeters) || x.frictionHeadMeters < 0)
    simpleError("frictionHeadMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.pressureHeadMeters) || x.pressureHeadMeters < 0)
    simpleError("pressureHeadMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.velocityHeadMeters) || x.velocityHeadMeters < 0)
    simpleError("velocityHeadMeters", "Provide a finite number at least 0.");
  const totalHeadMeters =
    x.staticLiftMeters +
    x.frictionHeadMeters +
    x.pressureHeadMeters +
    x.velocityHeadMeters;
  if (!Number.isFinite(totalHeadMeters))
    simpleError(
      "totalHeadMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    totalHeadMeters: Object.is(totalHeadMeters, -0) ? 0 : totalHeadMeters,
  };
};

export const example = {
  input: {
    staticLiftMeters: 5,
    frictionHeadMeters: 2,
    pressureHeadMeters: 3,
    velocityHeadMeters: 0.5,
  },
  output: { totalHeadMeters: 10.5 },
} satisfies ToolExample<PumpHeadTotalDynamicInput, PumpHeadTotalDynamicOutput>;

export const tool = createSimpleTool({
  id: "engineering/pump-head-total-dynamic",
  title: "Pump Head Total Dynamic",
  description:
    "Total dynamic pump head from signed static lift plus positive friction, discharge-pressure and velocity heads.",
  inputs: [
    {
      id: "staticLiftMeters",
      kind: "number",
      label: "Static Lift Meters",
      unit: "m",
    },
    {
      id: "frictionHeadMeters",
      kind: "number",
      label: "Friction Head Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "pressureHeadMeters",
      kind: "number",
      label: "Pressure Head Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "velocityHeadMeters",
      kind: "number",
      label: "Velocity Head Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalHeadMeters",
      kind: "number",
      label: "Total Head Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculatePumpHeadTotalDynamic({
      staticLiftMeters: input.staticLiftMeters as number,
      frictionHeadMeters: input.frictionHeadMeters as number,
      pressureHeadMeters: input.pressureHeadMeters as number,
      velocityHeadMeters: input.velocityHeadMeters as number,
    }),
});
export const pumpHeadTotalDynamicTool = tool;
export const runPumpHeadTotalDynamic = tool.execute;
export default tool;
