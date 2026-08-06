import { describe, expect, it } from "vitest";
import { aStarExample, runAStar } from "./tool.js";
describe("A*", () => {
  it("publishes an executable example", () =>
    expect(runAStar(aStarExample.input)).toEqual({
      ok: true,
      output: aStarExample.output,
    }));
});
