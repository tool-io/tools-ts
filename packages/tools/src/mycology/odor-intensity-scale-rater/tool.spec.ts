import { describe, expect, it } from "vitest";
import {
  odorIntensityScaleRaterExample,
  odorIntensityScaleRaterTool,
  runOdorIntensityScaleRater,
} from "./tool.js";

describe("odorIntensityScaleRaterTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOdorIntensityScaleRater(odorIntensityScaleRaterExample.input),
    ).toEqual({
      ok: true,
      output: odorIntensityScaleRaterExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(odorIntensityScaleRaterExample))).toEqual(
      odorIntensityScaleRaterExample,
    );
    expect(odorIntensityScaleRaterTool.contractVersion).toBe(1);
    expect(odorIntensityScaleRaterTool.execution).toEqual({ kind: "pure" });
  });

  it("rates no odor zero", () => {
    const r = runOdorIntensityScaleRater({ intensity: "none" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.odorRating).toBe(0);
    expect(r.output.intensity).toBe("none");
  });

  it("rates faint odor one", () => {
    const r = runOdorIntensityScaleRater({ intensity: "faint" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.odorRating).toBe(1);
    expect(r.output.intensity).toBe("faint");
  });

  it("rates strong odor three", () => {
    const r = runOdorIntensityScaleRater({ intensity: "strong" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.odorRating).toBe(3);
    expect(r.output.intensity).toBe("strong");
  });

  it("rates distinct odor two", () => {
    const r = runOdorIntensityScaleRater({ intensity: "distinct" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.odorRating).toBe(2);
  });

  it("rejects unknown intensities", () => {
    expect(runOdorIntensityScaleRater({ intensity: "pungent" }).ok).toBe(false);
    expect(runOdorIntensityScaleRater({ intensity: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runOdorIntensityScaleRater(null).ok).toBe(false);
    expect(runOdorIntensityScaleRater({ intensity: 2 }).ok).toBe(false);
    expect(
      runOdorIntensityScaleRater({
        ...odorIntensityScaleRaterExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
