import { describe, expect, it } from "vitest";
import { chao1BiasCorrectedExample, runChao1BiasCorrected } from "./tool.js";

describe("Chao1 Bias Corrected", () => {
  it("publishes an executable example", () =>
    expect(runChao1BiasCorrected(chao1BiasCorrectedExample.input)).toEqual({
      ok: true,
      output: chao1BiasCorrectedExample.output,
    }));
  it("returns the observed count without singletons", () =>
    expect(
      runChao1BiasCorrected({
        doubletonInt: 3,
        observedInt: 10,
        singletonInt: 0,
      }),
    ).toEqual({ ok: true, output: { biasCorrectedChao1: 10 } }));
  it("adds no correction for a lone singleton", () =>
    expect(
      runChao1BiasCorrected({
        doubletonInt: 0,
        observedInt: 7,
        singletonInt: 1,
      }),
    ).toEqual({ ok: true, output: { biasCorrectedChao1: 7 } }));
  it("grows with the squared singleton term", () =>
    expect(
      runChao1BiasCorrected({
        doubletonInt: 1,
        observedInt: 5,
        singletonInt: 4,
      }),
    ).toEqual({ ok: true, output: { biasCorrectedChao1: 8 } }));
  it("accepts all-zero auxiliary counts", () =>
    expect(
      runChao1BiasCorrected({
        doubletonInt: 0,
        observedInt: 1,
        singletonInt: 0,
      }),
    ).toEqual({ ok: true, output: { biasCorrectedChao1: 1 } }));
  it("keeps fractional estimates", () =>
    expect(
      runChao1BiasCorrected({
        doubletonInt: 2,
        observedInt: 8,
        singletonInt: 3,
      }),
    ).toEqual({ ok: true, output: { biasCorrectedChao1: 9 } }));
  it("rejects an empty community", () =>
    expect(
      runChao1BiasCorrected({
        doubletonInt: 0,
        observedInt: 0,
        singletonInt: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative counts", () =>
    expect(
      runChao1BiasCorrected({
        doubletonInt: -1,
        observedInt: 10,
        singletonInt: 5,
      }).ok,
    ).toBe(false));
  it("rejects frequency classes above observed richness", () =>
    expect(
      runChao1BiasCorrected({
        doubletonInt: 4,
        observedInt: 5,
        singletonInt: 3,
      }).ok,
    ).toBe(false));
});
