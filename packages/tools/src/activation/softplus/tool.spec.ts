import { describe, expect, it } from "vitest";
import { example, runSoftplus } from "./tool.js";

describe("activation/softplus", () => {
  it("executes its canonical example", () => {
    expect(runSoftplus(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("remains finite for a large positive input", () => {
    expect(runSoftplus({ x: 1000 })).toEqual({ ok: true, output: { y: 1000 } });
  });
});
