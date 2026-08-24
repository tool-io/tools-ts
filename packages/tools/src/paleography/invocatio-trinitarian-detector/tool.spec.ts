import { describe, expect, it } from "vitest";
import {
  invocatioTrinitarianDetectorExample,
  runInvocatioTrinitarianDetector,
} from "./tool.js";

describe("invocatio-trinitarian-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runInvocatioTrinitarianDetector(
        invocatioTrinitarianDetectorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: invocatioTrinitarianDetectorExample.output,
    });
  });

  it("rejects a single-person invocation as non-trinitarian", () => {
    const result = runInvocatioTrinitarianDetector({
      text: "In nomine Domini nostri Iesu Christi",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.isTrinitarian).toBe(false);
    expect(result.output.personGroupCount as number).toBe(0);
    expect(result.output.classification).toBe("non_trinitarian");
  });

  it("does not call a two-person invocation trinitarian", () => {
    const result = runInvocatioTrinitarianDetector({
      text: "In nomine Patris et Filii.",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.personGroupCount).toBe(2);
    expect(result.output.isTrinitarian).toBe(false);
  });

  it("rejects empty text", () => {
    expect(runInvocatioTrinitarianDetector({ text: "   " }).ok).toBe(false);
  });
});
