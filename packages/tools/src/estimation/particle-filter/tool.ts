import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export type ParticleFilterResult = {
  readonly estimates: readonly number[];
  readonly finalParticles: readonly number[];
};
const normal = (random: () => number) =>
  Math.sqrt(-2 * Math.log(Math.max(random(), Number.EPSILON))) *
  Math.cos(2 * Math.PI * random());
export const estimateWithParticleFilter = (
  observations: readonly number[],
  particleCount: number,
  processNoise: number,
  observationNoise: number,
  initialMean: number,
  initialSpread: number,
  seed: string,
): ParticleFilterResult | null => {
  if (
    !observations.length ||
    !seed.trim() ||
    processNoise < 0 ||
    observationNoise <= 0 ||
    initialSpread < 0
  )
    return null;
  const random = createSeededRandom(seed);
  let particles = Array.from(
    { length: particleCount },
    () => initialMean + normal(random) * initialSpread,
  );
  const estimates: number[] = [];
  for (const observation of observations) {
    particles = particles.map(
      (particle) => particle + normal(random) * processNoise,
    );
    const weights = particles.map((particle) =>
        Math.exp(-0.5 * ((observation - particle) / observationNoise) ** 2),
      ),
      total = weights.reduce((sum, weight) => sum + weight, 0);
    if (!Number.isFinite(total) || total === 0) return null;
    const cumulative: number[] = [];
    weights.reduce((sum, weight) => {
      cumulative.push(sum + weight / total);
      return sum + weight / total;
    }, 0);
    const resampled: number[] = [];
    for (let index = 0; index < particleCount; index += 1) {
      const target = (index + random()) / particleCount;
      resampled.push(
        particles[cumulative.findIndex((value) => value >= target)] ??
          particles[particles.length - 1]!,
      );
    }
    particles = resampled;
    estimates.push(
      Number(
        (
          particles.reduce((sum, value) => sum + value, 0) / particleCount
        ).toPrecision(10),
      ),
    );
  }
  return {
    estimates,
    finalParticles: particles.map((value) => Number(value.toPrecision(10))),
  };
};
export const particleFilterExample = {
  input: {
    initialMean: 0,
    initialSpread: 1,
    observationNoise: 0.5,
    observations: [1, 1.2],
    particleCount: 5,
    processNoise: 0.1,
    seed: "tool.io",
  },
  output: {
    result: {
      estimates: [0.9461976232, 1.357144525],
      finalParticles: [
        1.33369257, 1.421935259, 1.421935259, 1.304079769, 1.304079769,
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly initialMean: number;
    readonly initialSpread: number;
    readonly observationNoise: number;
    readonly observations: readonly number[];
    readonly particleCount: number;
    readonly processNoise: number;
    readonly seed: string;
  },
  { readonly result: ParticleFilterResult }
>;
export const particleFilterTool = createSimpleTool({
  id: "estimation/particle-filter",
  title: "Particle Filter Estimator",
  description:
    "Estimate a changing scalar state from noisy observations with seeded sequential Monte Carlo resampling.",
  inputs: [
    {
      format: "timeseries/observations",
      id: "observations",
      kind: "numberList",
      label: "Observations",
    },
    {
      id: "particleCount",
      kind: "integer",
      label: "Particles",
      maximum: 100_000,
      minimum: 2,
    },
    { id: "processNoise", kind: "number", label: "Process noise", minimum: 0 },
    {
      id: "observationNoise",
      kind: "number",
      label: "Observation noise",
      minimum: Number.MIN_VALUE,
    },
    { id: "initialMean", kind: "number", label: "Initial mean" },
    {
      id: "initialSpread",
      kind: "number",
      label: "Initial spread",
      minimum: 0,
    },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "estimation/particle-filter",
      id: "result",
      kind: "object",
      label: "Estimate",
    },
  ],
  calculate: (input) => {
    const result = estimateWithParticleFilter(
      input.observations as number[],
      input.particleCount as number,
      input.processNoise as number,
      input.observationNoise as number,
      input.initialMean as number,
      input.initialSpread as number,
      input.seed as string,
    );
    if (!result)
      return simpleError(
        "observations",
        "Enter observations and positive observation noise within supported limits.",
      );
    return { result };
  },
});
export const runParticleFilter = particleFilterTool.execute;
export default particleFilterTool;
