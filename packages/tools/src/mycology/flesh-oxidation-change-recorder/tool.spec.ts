import { describe, expect, it } from "vitest";
import {
  fleshOxidationChangeRecorderExample,
  fleshOxidationChangeRecorderTool,
  runFleshOxidationChangeRecorder,
} from "./tool.js";

describe("fleshOxidationChangeRecorderTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFleshOxidationChangeRecorder(
        fleshOxidationChangeRecorderExample.input,
      ),
    ).toEqual({
      ok: true,
      output: fleshOxidationChangeRecorderExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(fleshOxidationChangeRecorderExample)),
    ).toEqual(fleshOxidationChangeRecorderExample);
    expect(fleshOxidationChangeRecorderTool.contractVersion).toBe(1);
    expect(fleshOxidationChangeRecorderTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("notes no change for unreactive flesh", () => {
    const r = runFleshOxidationChangeRecorder({ change: "none" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.oxidationNote).toBe(
      "Flesh does not change color on exposure.",
    );
  });

  it("notes pink then black oxidation", () => {
    const r = runFleshOxidationChangeRecorder({ change: "pink-then-black" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.oxidationNote).toBe(
      "Flesh oxidizes pink then black on exposure.",
    );
  });

  it("notes red browning and yellowing", () => {
    const red = runFleshOxidationChangeRecorder({ change: "red-browning" });
    const yellow = runFleshOxidationChangeRecorder({ change: "yellowing" });
    if (!red.ok || !yellow.ok) throw new Error("expected success");
    expect(red.output.oxidationNote).toBe(
      "Flesh oxidizes red then brown on exposure.",
    );
    expect(yellow.output.oxidationNote).toBe(
      "Flesh oxidizes yellow on exposure.",
    );
  });

  it("notes blue bruising verbatim", () => {
    const r = runFleshOxidationChangeRecorder({ change: "blue-bruising" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.oxidationNote).toBe("Flesh oxidizes blue on exposure.");
  });

  it("rejects unknown changes", () => {
    expect(
      runFleshOxidationChangeRecorder({ change: "green-staining" }).ok,
    ).toBe(false);
    expect(runFleshOxidationChangeRecorder({ change: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runFleshOxidationChangeRecorder(null).ok).toBe(false);
    expect(runFleshOxidationChangeRecorder({ change: 0 }).ok).toBe(false);
    expect(
      runFleshOxidationChangeRecorder({
        ...fleshOxidationChangeRecorderExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
