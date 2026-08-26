import { describe, expect, it } from "vitest";
import {
  calculateCrucisDaggerMarkerChecker,
  crucisDaggerMarkerCheckerExample,
  runCrucisDaggerMarkerChecker,
} from "./tool.js";

describe("epigraphy/crucis-dagger-marker-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCrucisDaggerMarkerChecker(crucisDaggerMarkerCheckerExample.input),
    ).toEqual({ ok: true, output: crucisDaggerMarkerCheckerExample.output });
  });

  it("reports texts without a crux cleanly", () => {
    expect(
      calculateCrucisDaggerMarkerChecker({ text: "lectio certa" }),
    ).toEqual({ daggerCount: 0, positions: [], hasCrux: false });
  });

  it("counts adjacent daggers separately", () => {
    expect(
      calculateCrucisDaggerMarkerChecker({ text: "\u2020\u2020" }),
    ).toEqual({ daggerCount: 2, positions: [0, 1], hasCrux: true });
  });

  it("rejects empty input", () => {
    expect(runCrucisDaggerMarkerChecker({ text: "" }).ok).toBe(false);
  });
});
