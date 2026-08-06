import { describe, expect, it } from "vitest";
import { affinityPropagationExample, runAffinityPropagation } from "./tool.js";
describe("affinity propagation", () => {
  it("publishes an executable example", () =>
    expect(runAffinityPropagation(affinityPropagationExample.input)).toEqual({
      ok: true,
      output: affinityPropagationExample.output,
    }));
});
