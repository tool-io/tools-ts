import { describe, expect, it } from "vitest";
import {
  chlamydosporePositionDetectorExample,
  chlamydosporePositionDetectorTool,
  runChlamydosporePositionDetector,
} from "./tool.js";

describe("Chlamydospore Position", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runChlamydosporePositionDetector(
        chlamydosporePositionDetectorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: chlamydosporePositionDetectorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(chlamydosporePositionDetectorExample)),
    ).toEqual(chlamydosporePositionDetectorExample);
    expect(chlamydosporePositionDetectorTool.contractVersion).toBe(1);
    expect(chlamydosporePositionDetectorTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("marks intercalary and terminal positions as present", () => {
    for (const position of ["intercalary", "terminal"]) {
      const result = runChlamydosporePositionDetector({ position });
      expect(result.ok).toBe(true);
      if (result.ok)
        expect(result.output).toMatchObject({
          chlamydosporePosition: position,
          present: true,
        });
    }
  });

  it("marks the both position as present", () => {
    const result = runChlamydosporePositionDetector({ position: "both" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.present).toBe(true);
  });

  it("marks the absent position as not present", () => {
    const result = runChlamydosporePositionDetector({ position: "absent" });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output).toMatchObject({
        chlamydosporePosition: "absent",
        present: false,
      });
  });

  it("rejects positions outside the enum", () => {
    expect(runChlamydosporePositionDetector({ position: "lateral" }).ok).toBe(
      false,
    );
    expect(runChlamydosporePositionDetector({}).ok).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runChlamydosporePositionDetector(null).ok).toBe(false);
    expect(runChlamydosporePositionDetector({ position: 1 }).ok).toBe(false);
    expect(
      runChlamydosporePositionDetector({
        ...chlamydosporePositionDetectorExample.input,
        present: true,
      }).ok,
    ).toBe(false);
  });
});
