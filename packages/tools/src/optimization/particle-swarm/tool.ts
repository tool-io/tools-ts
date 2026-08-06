import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { createSeededRandom } from "../../random/seeded-number/tool.js";

export type ParticleSwarmResult = {
  readonly minimum: number;
  readonly objective: string;
  readonly position: readonly number[];
};
const objectives = {
  rastrigin: (position: readonly number[]) =>
    10 * position.length +
    position.reduce(
      (sum, value) => sum + value * value - 10 * Math.cos(2 * Math.PI * value),
      0,
    ),
  sphere: (position: readonly number[]) =>
    position.reduce((sum, value) => sum + value * value, 0),
};
export const solveWithParticleSwarm = (
  objectiveName: keyof typeof objectives,
  dimensions: number,
  particleCount: number,
  iterations: number,
  minimum: number,
  maximum: number,
  seed: string,
): ParticleSwarmResult | null => {
  const objective = objectives[objectiveName];
  if (
    !objective ||
    !seed.trim() ||
    minimum >= maximum ||
    dimensions * particleCount * iterations > 20_000_000
  )
    return null;
  const random = createSeededRandom(seed),
    span = maximum - minimum;
  const positions = Array.from({ length: particleCount }, () =>
    Array.from({ length: dimensions }, () => minimum + random() * span),
  );
  const velocities = positions.map(() =>
    Array.from({ length: dimensions }, () => (random() - 0.5) * span * 0.2),
  );
  const personalBest = positions.map((position) => [...position]),
    personalValues = positions.map(objective);
  let bestIndex = personalValues.indexOf(Math.min(...personalValues)),
    globalBest = [...personalBest[bestIndex]!],
    globalValue = personalValues[bestIndex]!;
  for (let iteration = 0; iteration < iterations; iteration += 1)
    for (let particle = 0; particle < particleCount; particle += 1) {
      for (let dimension = 0; dimension < dimensions; dimension += 1) {
        velocities[particle]![dimension] =
          0.729 * velocities[particle]![dimension]! +
          1.49445 *
            random() *
            (personalBest[particle]![dimension]! -
              positions[particle]![dimension]!) +
          1.49445 *
            random() *
            (globalBest[dimension]! - positions[particle]![dimension]!);
        positions[particle]![dimension] = Math.max(
          minimum,
          Math.min(
            maximum,
            positions[particle]![dimension]! +
              velocities[particle]![dimension]!,
          ),
        );
      }
      const value = objective(positions[particle]!);
      if (value < personalValues[particle]!) {
        personalValues[particle] = value;
        personalBest[particle] = [...positions[particle]!];
        if (value < globalValue) {
          globalValue = value;
          globalBest = [...positions[particle]!];
        }
      }
    }
  return {
    minimum: Number(globalValue.toPrecision(12)),
    objective: objectiveName,
    position: globalBest.map((value) => Number(value.toPrecision(12))),
  };
};
export const particleSwarmExample = {
  input: {
    dimensions: 2,
    iterations: 5,
    maximum: 5,
    minimum: -5,
    objective: "sphere",
    particleCount: 5,
    seed: "tool.io",
  },
  output: {
    result: {
      minimum: 0.0357679394321,
      objective: "sphere",
      position: [0.137300045071, 0.130063972935],
    },
  },
} satisfies ToolExample<
  {
    readonly dimensions: number;
    readonly iterations: number;
    readonly maximum: number;
    readonly minimum: number;
    readonly objective: string;
    readonly particleCount: number;
    readonly seed: string;
  },
  { readonly result: ParticleSwarmResult }
>;
export const particleSwarmTool = createSimpleTool({
  id: "optimization/particle-swarm",
  title: "Particle Swarm Optimization Solver",
  description:
    "Minimize Sphere or Rastrigin functions with a reproducible bounded particle swarm.",
  inputs: [
    {
      enum: ["sphere", "rastrigin"],
      id: "objective",
      kind: "string",
      label: "Objective",
    },
    {
      id: "dimensions",
      kind: "integer",
      label: "Dimensions",
      maximum: 100,
      minimum: 1,
    },
    {
      id: "particleCount",
      kind: "integer",
      label: "Particles",
      maximum: 10_000,
      minimum: 2,
    },
    {
      id: "iterations",
      kind: "integer",
      label: "Iterations",
      maximum: 100_000,
      minimum: 1,
    },
    { id: "minimum", kind: "number", label: "Minimum bound" },
    { id: "maximum", kind: "number", label: "Maximum bound" },
    { id: "seed", kind: "string", label: "Seed" },
  ],
  outputs: [
    {
      format: "optimization/solution",
      id: "result",
      kind: "object",
      label: "Best solution",
    },
  ],
  calculate: (input) => {
    const result = solveWithParticleSwarm(
      input.objective as keyof typeof objectives,
      input.dimensions as number,
      input.particleCount as number,
      input.iterations as number,
      input.minimum as number,
      input.maximum as number,
      input.seed as string,
    );
    if (!result)
      return simpleError(
        "iterations",
        "Enter valid bounds and keep the requested work within the supported limit.",
      );
    return { result };
  },
});
export const runParticleSwarm = particleSwarmTool.execute;
export default particleSwarmTool;
