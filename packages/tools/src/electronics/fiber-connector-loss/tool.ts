import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiberConnectorLossInput = Readonly<{
  readonly incidentMilliwatts: number;
  readonly transmittedMilliwatts: number;
}>;
export type FiberConnectorLossOutput = Readonly<{
  readonly lossDecibels: number;
}>;

export const calculateFiberConnectorLoss = (
  x: FiberConnectorLossInput,
): FiberConnectorLossOutput => {
  if (!Number.isFinite(x.incidentMilliwatts) || x.incidentMilliwatts < 0)
    simpleError("incidentMilliwatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.transmittedMilliwatts) || x.transmittedMilliwatts < 0)
    simpleError("transmittedMilliwatts", "Provide a finite number at least 0.");
  if (x.transmittedMilliwatts > x.incidentMilliwatts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const lossDecibels =
    10 * Math.log10(x.incidentMilliwatts / x.transmittedMilliwatts);
  if (!Number.isFinite(lossDecibels))
    simpleError(
      "lossDecibels",
      "Inputs produce an undefined or non-finite result.",
    );
  return { lossDecibels: Object.is(lossDecibels, -0) ? 0 : lossDecibels };
};

export const example = {
  input: { incidentMilliwatts: 10, transmittedMilliwatts: 5 },
  output: { lossDecibels: 3.010299956639812 },
} satisfies ToolExample<FiberConnectorLossInput, FiberConnectorLossOutput>;

export const tool = createSimpleTool({
  id: "electronics/fiber-connector-loss",
  title: "Fiber Connector Loss",
  description:
    "Optical insertion loss of a connector from incident and transmitted powers measured with the same reference.",
  inputs: [
    {
      id: "incidentMilliwatts",
      kind: "number",
      label: "Incident Milliwatts",
      unit: "mW",
      minimum: 0,
    },
    {
      id: "transmittedMilliwatts",
      kind: "number",
      label: "Transmitted Milliwatts",
      unit: "mW",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lossDecibels", kind: "number", label: "Loss Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateFiberConnectorLoss({
      incidentMilliwatts: input.incidentMilliwatts as number,
      transmittedMilliwatts: input.transmittedMilliwatts as number,
    }),
});
export const fiberConnectorLossTool = tool;
export const runFiberConnectorLoss = tool.execute;
export default tool;
