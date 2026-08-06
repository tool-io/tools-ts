import { describe, expect, it } from "vitest";
import { particleFilterExample, runParticleFilter } from "./tool.js";
describe("particle filter", () => {
  it("publishes an executable example", () =>
    expect(runParticleFilter(particleFilterExample.input)).toEqual({
      ok: true,
      output: particleFilterExample.output,
    }));
});
