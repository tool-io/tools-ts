import { describe, expect, it } from "vitest";
import {
  capShapeProfileClassifierExample,
  capShapeProfileClassifierTool,
  runCapShapeProfileClassifier,
} from "./tool.js";

describe("capShapeProfileClassifierTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapShapeProfileClassifier(capShapeProfileClassifierExample.input),
    ).toEqual({
      ok: true,
      output: capShapeProfileClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(capShapeProfileClassifierExample)),
    ).toEqual(capShapeProfileClassifierExample);
    expect(capShapeProfileClassifierTool.contractVersion).toBe(1);
    expect(capShapeProfileClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("passes through the convex and plane profiles", () => {
    const convex = runCapShapeProfileClassifier({ profile: "convex" });
    const plane = runCapShapeProfileClassifier({ profile: "plane" });
    if (!convex.ok || !plane.ok) throw new Error("expected success");
    expect(convex.output.capShapeClass).toBe("convex");
    expect(plane.output.capShapeClass).toBe("plane");
  });

  it("passes through the depressed and infundibuliform profiles", () => {
    const depressed = runCapShapeProfileClassifier({ profile: "depressed" });
    const infundibuliform = runCapShapeProfileClassifier({
      profile: "infundibuliform",
    });
    if (!depressed.ok || !infundibuliform.ok)
      throw new Error("expected success");
    expect(depressed.output.capShapeClass).toBe("depressed");
    expect(infundibuliform.output.capShapeClass).toBe("infundibuliform");
  });

  it("passes through the campanulate and conical profiles", () => {
    const campanulate = runCapShapeProfileClassifier({
      profile: "campanulate",
    });
    const conical = runCapShapeProfileClassifier({ profile: "conical" });
    if (!campanulate.ok || !conical.ok) throw new Error("expected success");
    expect(campanulate.output.capShapeClass).toBe("campanulate");
    expect(conical.output.capShapeClass).toBe("conical");
  });

  it("passes through the umbonate profile", () => {
    const r = runCapShapeProfileClassifier({ profile: "umbonate" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.capShapeClass).toBe("umbonate");
  });

  it("rejects unknown profiles", () => {
    expect(runCapShapeProfileClassifier({ profile: "cylindrical" }).ok).toBe(
      false,
    );
    expect(runCapShapeProfileClassifier({ profile: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runCapShapeProfileClassifier(null).ok).toBe(false);
    expect(runCapShapeProfileClassifier({ profile: true }).ok).toBe(false);
    expect(
      runCapShapeProfileClassifier({
        ...capShapeProfileClassifierExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
