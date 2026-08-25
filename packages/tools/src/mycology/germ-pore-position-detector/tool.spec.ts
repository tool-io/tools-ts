import { describe, expect, it } from "vitest";
import {
  germPorePositionDetectorExample,
  runGermPorePositionDetector,
} from "./tool.js";

describe("Germ Pore Position", () => {
  it("matches the canonical example", () => {
    expect(
      runGermPorePositionDetector(germPorePositionDetectorExample.input),
    ).toEqual({
      ok: true,
      output: germPorePositionDetectorExample.output,
    });
  });
  it("passes through subapical", () =>
    expect(
      runGermPorePositionDetector({ position: "subapical" }),
    ).toMatchObject({
      ok: true,
      output: { germPoreType: "subapical" },
    }));
  it("passes through lateral", () =>
    expect(runGermPorePositionDetector({ position: "lateral" })).toMatchObject({
      ok: true,
      output: { germPoreType: "lateral" },
    }));
  it("passes through multiple-distal", () =>
    expect(
      runGermPorePositionDetector({ position: "multiple-distal" }),
    ).toMatchObject({
      ok: true,
      output: { germPoreType: "multiple-distal" },
    }));
  it("rejects unknown positions", () =>
    expect(
      runGermPorePositionDetector({
        position: "central",
      } as unknown as { position: "apical" }).ok,
    ).toBe(false));
  it("requires the position field", () =>
    expect(
      runGermPorePositionDetector({} as unknown as { position: "apical" }).ok,
    ).toBe(false));
});
