import { describe, expect, it } from "vitest";
import {
  hyphalSystemClassifierExample,
  runHyphalSystemClassifier,
} from "./tool.js";

describe("Hyphal System Classifier", () => {
  it("matches the canonical example", () => {
    expect(
      runHyphalSystemClassifier(hyphalSystemClassifierExample.input),
    ).toEqual({
      ok: true,
      output: hyphalSystemClassifierExample.output,
    });
  });
  it("classifies trimitic systems", () =>
    expect(
      runHyphalSystemClassifier({
        binding: true,
        generative: true,
        skeletal: true,
      }),
    ).toEqual({ ok: true, output: { hyphalSystem: "trimitic" } }));
  it("classifies dimitic with skeletal hyphae", () =>
    expect(
      runHyphalSystemClassifier({
        binding: false,
        generative: true,
        skeletal: true,
      }),
    ).toEqual({ ok: true, output: { hyphalSystem: "dimitic" } }));
  it("classifies dimitic with binding hyphae", () =>
    expect(
      runHyphalSystemClassifier({
        binding: true,
        generative: true,
        skeletal: false,
      }),
    ).toEqual({ ok: true, output: { hyphalSystem: "dimitic" } }));
  it("rejects all-false inputs as invalid_system", () =>
    expect(
      runHyphalSystemClassifier({
        binding: false,
        generative: false,
        skeletal: false,
      }),
    ).toMatchObject({
      ok: false,
      error: { code: "invalid_input", issues: [{ code: "invalid_system" }] },
    }));
  it("rejects skeletal and binding without generative as invalid_system", () =>
    expect(
      runHyphalSystemClassifier({
        binding: true,
        generative: false,
        skeletal: true,
      }).ok,
    ).toBe(false));
  it("requires every hyphal flag", () =>
    expect(
      runHyphalSystemClassifier({
        binding: false,
        generative: true,
      } as unknown as {
        binding: boolean;
        generative: boolean;
        skeletal: boolean;
      }).ok,
    ).toBe(false));
});
