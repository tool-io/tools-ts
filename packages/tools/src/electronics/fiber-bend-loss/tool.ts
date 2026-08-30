import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiberBendLossInput = Readonly<{
  readonly beforeMilliwatts: number;
  readonly afterMilliwatts: number;
}>;
export type FiberBendLossOutput = Readonly<{
  readonly bendLossDecibels: number;
}>;

export const calculateFiberBendLoss = (
  x: FiberBendLossInput,
): FiberBendLossOutput => {
  if (!Number.isFinite(x.beforeMilliwatts) || x.beforeMilliwatts < 0)
    simpleError("beforeMilliwatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.afterMilliwatts) || x.afterMilliwatts < 0)
    simpleError("afterMilliwatts", "Provide a finite number at least 0.");
  if (x.afterMilliwatts > x.beforeMilliwatts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const bendLossDecibels =
    10 * Math.log10(x.beforeMilliwatts / x.afterMilliwatts);
  if (!Number.isFinite(bendLossDecibels))
    simpleError(
      "bendLossDecibels",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    bendLossDecibels: Object.is(bendLossDecibels, -0) ? 0 : bendLossDecibels,
  };
};

export const example = {
  input: { beforeMilliwatts: 10, afterMilliwatts: 5 },
  output: { bendLossDecibels: 3.010299956639812 },
} satisfies ToolExample<FiberBendLossInput, FiberBendLossOutput>;

export const tool = createSimpleTool({
  id: "electronics/fiber-bend-loss",
  title: "Fiber Bend Loss",
  description:
    "Additional optical bend loss from through-power measurements before and after introducing a bend.",
  inputs: [
    {
      id: "beforeMilliwatts",
      kind: "number",
      label: "Before Milliwatts",
      unit: "mW",
      minimum: 0,
    },
    {
      id: "afterMilliwatts",
      kind: "number",
      label: "After Milliwatts",
      unit: "mW",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "bendLossDecibels",
      kind: "number",
      label: "Bend Loss Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateFiberBendLoss({
      beforeMilliwatts: input.beforeMilliwatts as number,
      afterMilliwatts: input.afterMilliwatts as number,
    }),
});
export const fiberBendLossTool = tool;
export const runFiberBendLoss = tool.execute;
export default tool;
