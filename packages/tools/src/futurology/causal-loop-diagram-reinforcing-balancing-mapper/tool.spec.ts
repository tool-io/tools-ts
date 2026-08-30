import { describe, expect, it } from "vitest";
import {
  causalLoopMapperExample,
  classifyCausalLoops,
  runCausalLoopMapper,
} from "./tool.js";

describe("causal loop reinforcing balancing mapper", () => {
  it("reproduces its canonical example", () => {
    expect(runCausalLoopMapper(causalLoopMapperExample.input)).toEqual({
      ok: true,
      output: causalLoopMapperExample.output,
    });
  });

  it("classifies positive sign products as reinforcing", () => {
    expect(
      classifyCausalLoops({ loopIds: ["A", "B"], loopSignProducts: [1, 1] }),
    ).toMatchObject({ reinforcingLoopIds: ["A", "B"] });
  });

  it("reports a balancing loop", () => {
    expect(
      classifyCausalLoops({ loopIds: ["A"], loopSignProducts: [-1] }),
    ).toMatchObject({ balancingLoopIds: ["A"] });
  });

  it("rejects a zero loop sign", () => {
    expect(
      runCausalLoopMapper({ loopIds: ["A"], loopSignProducts: [0] }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_loop_sign", field: "loopSignProducts.0" }],
      },
      ok: false,
    });
  });
});
