import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TheisDrawdownInput = {
  readonly dischargeM3PerDay: number;
  readonly transmissivityM2PerDay: number;
  readonly distanceToWellM: number;
  readonly storativity: number;
  readonly elapsedDays: number;
};

export type TheisDrawdownOutput = {
  readonly dimensionlessU: number;
  readonly wellFunctionW: number;
  readonly drawdownM: number;
};

const EULER_GAMMA = 0.5772156649015329;

/**
 * Exponential integral E1(x) = integral from x to infinity of e^-t / t dt,
 * via power series for x < 1 and a continued fraction for x >= 1.
 */
const exponentialIntegralE1 = (x: number): number => {
  if (x < 1) {
    let sum = -EULER_GAMMA - Math.log(x);
    let term = x;
    for (let k = 1; k < 400; k += 1) {
      term *= -x / k;
      const next = sum + term / k;
      if (next === sum) break;
      sum = next;
    }
    return sum;
  }
  let fraction = 0;
  for (let a = 120; a >= 1; a -= 1) fraction = a / (1 + a / (x + fraction));
  return Math.exp(-x) / (x + fraction);
};

export const calculateTheisDrawdown = (
  input: TheisDrawdownInput,
): TheisDrawdownOutput => {
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
  const u =
    (input.distanceToWellM ** 2 * input.storativity) /
    (4 * input.transmissivityM2PerDay * input.elapsedDays);
  const wellFunction = exponentialIntegralE1(u);
  return {
    dimensionlessU: u,
    wellFunctionW: wellFunction,
    drawdownM:
      (input.dischargeM3PerDay / (4 * Math.PI * input.transmissivityM2PerDay)) *
      wellFunction,
  };
};

export const theisDrawdownExample = {
  input: {
    dischargeM3PerDay: 500,
    transmissivityM2PerDay: 100,
    distanceToWellM: 30,
    storativity: 0.0002,
    elapsedDays: 1,
  },
  output: {
    dimensionlessU: 0.00045000000000000004,
    wellFunctionW: 7.129047107821155,
    drawdownM: 2.8365577168617923,
  },
} satisfies ToolExample<TheisDrawdownInput, TheisDrawdownOutput>;

export const theisDrawdownTool = createSimpleTool({
  id: "geology/theis-drawdown",
  title: "Theis Drawdown Calculator",
  description:
    "Compute Theis non-equilibrium drawdown in meters from discharge (m3/day), transmissivity (m2/day), radial distance (m), storativity and elapsed time (days).",
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
      description: "Dimensionless argument u = r^2 S / (4 T t).",
      id: "dimensionlessU",
      kind: "number",
      label: "u",
    },
    {
      description: "Theis well function W(u).",
      id: "wellFunctionW",
      kind: "number",
      label: "W(u)",
    },
    {
      description: "Drawdown at the observation point in meters.",
      id: "drawdownM",
      kind: "number",
      label: "s",
    },
  ],
  calculate: (input) =>
    calculateTheisDrawdown(input as unknown as TheisDrawdownInput),
});

export const runTheisDrawdown = theisDrawdownTool.execute;
export default theisDrawdownTool;
