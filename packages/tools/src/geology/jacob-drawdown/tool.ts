import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JacobDrawdownInput = {
  readonly dischargeM3PerDay: number;
  readonly transmissivityM2PerDay: number;
  readonly distanceToWellM: number;
  readonly storativity: number;
  readonly elapsedDays: number;
};

export type JacobDrawdownOutput = {
  readonly drawdownM: number;
};

const LN10 = Math.LN10;

export const calculateJacobDrawdown = (
  input: JacobDrawdownInput,
): JacobDrawdownOutput => {
  if (!(input.dischargeM3PerDay > 0))
    simpleError(
      "dischargeM3PerDay",
      "Pumping discharge must be greater than zero.",
      "invalid_discharge",
    );
  if (!(input.transmissivityM2PerDay > 0))
    simpleError(
      "transmissivityM2PerDay",
      "Transmissivity must be greater than zero.",
      "invalid_transmissivity",
    );
  if (!(input.distanceToWellM > 0))
    simpleError(
      "distanceToWellM",
      "Distance to the well must be greater than zero.",
      "invalid_distance",
    );
  if (!(input.storativity > 0))
    simpleError(
      "storativity",
      "Storativity must be greater than zero.",
      "invalid_storativity",
    );
  if (!(input.elapsedDays > 0))
    simpleError(
      "elapsedDays",
      "Elapsed pumping time must be greater than zero.",
      "invalid_time",
    );
  const argument =
    (2.25 * input.transmissivityM2PerDay * input.elapsedDays) /
    (input.distanceToWellM ** 2 * input.storativity);
  return {
    drawdownM:
      ((2.302585092994046 * input.dischargeM3PerDay) /
        (4 * Math.PI * input.transmissivityM2PerDay)) *
      (Math.log(argument) / LN10),
  };
};

export const jacobDrawdownExample = {
  input: {
    dischargeM3PerDay: 500,
    transmissivityM2PerDay: 100,
    distanceToWellM: 30,
    storativity: 0.0002,
    elapsedDays: 1,
  },
  output: { drawdownM: 2.8372944938246945 },
} satisfies ToolExample<JacobDrawdownInput, JacobDrawdownOutput>;

export const jacobDrawdownTool = createSimpleTool({
  id: "geology/jacob-drawdown",
  title: "Jacob Drawdown Calculator",
  description:
    "Compute the Cooper-Jacob straight-line approximation of drawdown in meters from discharge (m3/day), transmissivity (m2/day), radial distance (m), storativity and time (days).",
  inputs: [
    {
      description: "Constant pumping discharge in cubic meters per day.",
      id: "dischargeM3PerDay",
      kind: "number",
      label: "Q",
    },
    {
      description: "Transmissivity in square meters per day.",
      id: "transmissivityM2PerDay",
      kind: "number",
      label: "T",
    },
    {
      description: "Radial distance from the well in meters.",
      id: "distanceToWellM",
      kind: "number",
      label: "r",
    },
    {
      description: "Aquifer storativity (dimensionless).",
      id: "storativity",
      kind: "number",
      label: "S",
    },
    {
      description: "Time since pumping began in days.",
      id: "elapsedDays",
      kind: "number",
      label: "t",
    },
  ],
  outputs: [
    {
      description: "Jacob straight-line drawdown in meters.",
      id: "drawdownM",
      kind: "number",
      label: "s",
    },
  ],
  calculate: (input) =>
    calculateJacobDrawdown(input as unknown as JacobDrawdownInput),
});

export const runJacobDrawdown = jacobDrawdownTool.execute;
export default jacobDrawdownTool;
