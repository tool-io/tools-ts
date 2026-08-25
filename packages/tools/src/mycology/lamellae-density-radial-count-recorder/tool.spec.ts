import { describe, expect, it } from "vitest";
import {
  lamellaeDensityRadialCountRecorderExample,
  lamellaeDensityRadialCountRecorderTool,
  runLamellaeDensityRadialCountRecorder,
} from "./tool.js";

describe("lamellaeDensityRadialCountRecorderTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLamellaeDensityRadialCountRecorder(
        lamellaeDensityRadialCountRecorderExample.input,
      ),
    ).toEqual({
      ok: true,
      output: lamellaeDensityRadialCountRecorderExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(lamellaeDensityRadialCountRecorderExample)),
    ).toEqual(lamellaeDensityRadialCountRecorderExample);
    expect(lamellaeDensityRadialCountRecorderTool.contractVersion).toBe(1);
    expect(lamellaeDensityRadialCountRecorderTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("records zero and sparse counts without inventing density bands", () => {
    const zero = runLamellaeDensityRadialCountRecorder({ gillsCountedInt: 0 });
    const sparse = runLamellaeDensityRadialCountRecorder({
      gillsCountedInt: 39,
    });
    if (!zero.ok || !sparse.ok) throw new Error("expected success");
    expect(zero.output.lamellaeCount).toBe(0);
    expect(sparse.output.lamellaeCount).toBe(39);
  });

  it("records former bucket boundaries unchanged", () => {
    const atForty = runLamellaeDensityRadialCountRecorder({
      gillsCountedInt: 40,
    });
    const atNinety = runLamellaeDensityRadialCountRecorder({
      gillsCountedInt: 90,
    });
    if (!atForty.ok || !atNinety.ok) throw new Error("expected success");
    expect(atForty.output.lamellaeCount).toBe(40);
    expect(atNinety.output.lamellaeCount).toBe(90);
  });

  it("records high counts unchanged", () => {
    const r = runLamellaeDensityRadialCountRecorder({ gillsCountedInt: 91 });
    const many = runLamellaeDensityRadialCountRecorder({
      gillsCountedInt: 200,
    });
    if (!r.ok || !many.ok) throw new Error("expected success");
    expect(r.output.lamellaeCount).toBe(91);
    expect(many.output.lamellaeCount).toBe(200);
  });

  it("records the raw count unchanged", () => {
    const r = runLamellaeDensityRadialCountRecorder({ gillsCountedInt: 73 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.lamellaeCount).toBe(73);
  });

  it("rejects negative counts", () => {
    expect(
      runLamellaeDensityRadialCountRecorder({ gillsCountedInt: -1 }).ok,
    ).toBe(false);
  });

  it("rejects non-integer and malformed input", () => {
    expect(
      runLamellaeDensityRadialCountRecorder({ gillsCountedInt: 12.5 }).ok,
    ).toBe(false);
    expect(runLamellaeDensityRadialCountRecorder(null).ok).toBe(false);
    expect(
      runLamellaeDensityRadialCountRecorder({
        ...lamellaeDensityRadialCountRecorderExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
