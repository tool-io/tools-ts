import { describe, expect, it } from "vitest";
import { ponderalIndexExample, runPonderalIndex } from "./tool.js";
describe("ponderal index", () => {
  it("publishes an executable example", () =>
    expect(runPonderalIndex(ponderalIndexExample.input)).toEqual({
      ok: true,
      output: ponderalIndexExample.output,
    }));
});
