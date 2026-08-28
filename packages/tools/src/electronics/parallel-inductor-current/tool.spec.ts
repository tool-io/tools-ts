import { describe, expect, it } from "vitest";
import {
  parallelInductorCurrentExample,
  runParallelInductorCurrent,
} from "./tool.js";
describe("Parallel Inductor Current Split", () => {
  it("publishes an executable example", () =>
    expect(
      runParallelInductorCurrent(parallelInductorCurrentExample.input),
    ).toEqual({ ok: true, output: parallelInductorCurrentExample.output }));
  it("splits equal inductors evenly", () =>
    expect(
      runParallelInductorCurrent({ totalCurrentA: 4, l1: 5, l2: 5 }),
    ).toEqual({ ok: true, output: { currentThroughL1A: 2 } }));
  it("rejects zero L1", () =>
    expect(
      runParallelInductorCurrent({ totalCurrentA: 1, l1: 0, l2: 1 }).ok,
    ).toBe(false));
  it("rejects negative L2", () =>
    expect(
      runParallelInductorCurrent({ totalCurrentA: 1, l1: 1, l2: -1 }).ok,
    ).toBe(false));
});
