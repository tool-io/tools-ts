import { describe, expect, it } from "vitest";
import {
  ornamentationTypeClassifierExample,
  runOrnamentationTypeClassifier,
} from "./tool.js";

describe("Ornamentation Classifier", () => {
  it("matches the canonical example", () => {
    expect(
      runOrnamentationTypeClassifier(ornamentationTypeClassifierExample.input),
    ).toEqual({
      ok: true,
      output: ornamentationTypeClassifierExample.output,
    });
  });
  it("passes through smooth", () =>
    expect(runOrnamentationTypeClassifier({ type: "smooth" })).toEqual({
      ok: true,
      output: { ornamentationClass: "smooth" },
    }));
  it("passes through punctate", () =>
    expect(runOrnamentationTypeClassifier({ type: "punctate" })).toEqual({
      ok: true,
      output: { ornamentationClass: "punctate" },
    }));
  it("passes through warted", () =>
    expect(runOrnamentationTypeClassifier({ type: "warted" })).toEqual({
      ok: true,
      output: { ornamentationClass: "warted" },
    }));
  it("passes through spiny", () =>
    expect(runOrnamentationTypeClassifier({ type: "spiny" })).toEqual({
      ok: true,
      output: { ornamentationClass: "spiny" },
    }));
  it("passes through ridged", () =>
    expect(runOrnamentationTypeClassifier({ type: "ridged" })).toEqual({
      ok: true,
      output: { ornamentationClass: "ridged" },
    }));
  it("rejects unknown types", () =>
    expect(
      runOrnamentationTypeClassifier({
        type: "striate",
      } as unknown as { type: "smooth" }).ok,
    ).toBe(false));
  it("requires the type field", () =>
    expect(
      runOrnamentationTypeClassifier({} as unknown as { type: "smooth" }).ok,
    ).toBe(false));
});
