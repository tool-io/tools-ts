import { describe, expect, it } from "vitest";
import { particleSwarmExample, runParticleSwarm } from "./tool.js";
describe("particle swarm", () => {
  it("publishes an executable example", () =>
    expect(runParticleSwarm(particleSwarmExample.input)).toEqual({
      ok: true,
      output: particleSwarmExample.output,
    }));
});
