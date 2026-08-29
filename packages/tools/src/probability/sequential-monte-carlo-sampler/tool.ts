import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { sampleSequentialMonteCarlo } from "../advanced-samplers.js";

export const example = {
  input: {
    observations: [0, 1],
    particleCount: 100,
    processStandardDeviation: 1,
    observationStandardDeviation: 1,
    initialStandardDeviation: 1,
    seed: "tool.io",
  },
  output: {
    posteriorMeans: [0.023594715684974326, 0.5502542152381746],
    finalParticles: [
      -0.7771582380021986, 1.4522181947430945, 1.4522181947430945,
      -0.3436198766670706, -0.7499685524313234, 0.926297434929322,
      0.926297434929322, 1.5927838219011843, 1.5927838219011843,
      2.1512610510829253, 0.05005203439935468, 0.05005203439935468,
      0.6598201184271248, 0.6598201184271248, -1.0508699327954718,
      0.1581076675661342, -0.44860961636816926, -0.501057891875651,
      -0.4503813118085226, 0.15611770020710383, 0.15611770020710383,
      1.0359810744210165, 1.0359810744210165, 1.0265737909237282,
      1.0265737909237282, 0.42469194414255357, 0.42469194414255357,
      1.7481232759790393, 1.7481232759790393, 0.016202408414734387,
      0.016202408414734387, 1.4170943217289336, 1.4170943217289336,
      -0.25756664331108947, -0.12269921169771719, -0.9183044640176269,
      -1.0515121718540987, 0.019185547213443677, 0.937281731720613,
      0.937281731720613, -0.6585665222226572, 0.4115320349882156,
      0.4115320349882156, 0.85445364415191, 0.85445364415191,
      0.06749115846573983, 0.3069366956204792, 0.3069366956204792,
      0.1415509863014246, 0.1415509863014246, 1.067417904393964,
      1.067417904393964, 0.05977648911157063, 0.05977648911157063,
      0.9427631006952446, 0.9427631006952446, 1.240835624605031,
      1.240835624605031, 0.6460754567478091, 0.6460754567478091,
      1.329979967003854, 1.329979967003854, 1.329979967003854,
      1.0861134422283607, 1.0861134422283607, 1.3195292105227185,
      1.3195292105227185, 0.678289501203607, 0.678289501203607,
      0.6956042234742765, 0.6956042234742765, 2.297604254032615,
      -0.7751404314924053, 0.3429596744088101, 0.3429596744088101,
      0.3321735377269062, 0.3321735377269062, -0.48260819632454544,
      1.7529733925490552, 1.7529733925490552, 0.9031018504520614,
      0.9031018504520614, 0.04387047923880116, -1.0004542410811788,
      0.5362733541319642, 0.5362733541319642, 1.2985798948499325,
      1.2985798948499325, 0.7274659131649638, 0.7274659131649638,
      -0.4948044759637065, 0.04859639451790777, 2.3731667575282316,
      0.761455248754866, 0.761455248754866, -0.19282943647843054,
      -0.2398312079906073, -0.1180728116864731, 0.4933449759806756,
      0.4933449759806756,
    ],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "probability/sequential-monte-carlo-sampler",
  title: "Sequential Monte Carlo Gaussian Filter",
  description:
    "Run a bootstrap particle filter for a one-dimensional Gaussian random walk observed with Gaussian noise; report weighted posterior means and resampled final particles.",
  inputs: [
    { id: "observations", kind: "numberList", label: "observations" },
    {
      id: "particleCount",
      kind: "integer",
      label: "particle Count",
      minimum: 10,
      maximum: 1000,
    },
    {
      id: "processStandardDeviation",
      kind: "number",
      label: "process Standard Deviation",
      minimum: 5e-324,
    },
    {
      id: "observationStandardDeviation",
      kind: "number",
      label: "observation Standard Deviation",
      minimum: 5e-324,
    },
    {
      id: "initialStandardDeviation",
      kind: "number",
      label: "initial Standard Deviation",
      minimum: 5e-324,
    },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [
    { id: "posteriorMeans", kind: "numberList", label: "posterior Means" },
    { id: "finalParticles", kind: "numberList", label: "final Particles" },
  ],
  calculate: (input) =>
    sampleSequentialMonteCarlo(
      input.observations as number[],
      input.particleCount as number,
      input.processStandardDeviation as number,
      input.observationStandardDeviation as number,
      input.initialStandardDeviation as number,
      input.seed as string,
    ),
});
export type SequentialMonteCarloSamplerInput = Readonly<typeof example.input>;
export type SequentialMonteCarloSamplerOutput = Readonly<typeof example.output>;
export const sequentialMonteCarloSamplerTool = tool;
export const runSequentialMonteCarloSampler = tool.execute;
export default tool;
