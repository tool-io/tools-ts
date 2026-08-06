import { describe, expect, it } from "vitest";
import { beamSearchExample, runBeamSearch } from "./tool.js";
describe("beam search", () => {
  it("publishes an executable example", () =>
    expect(runBeamSearch(beamSearchExample.input)).toEqual({
      ok: true,
      output: beamSearchExample.output,
    }));
});
