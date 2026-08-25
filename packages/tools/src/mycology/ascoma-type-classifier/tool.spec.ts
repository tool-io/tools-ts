import { describe, expect, it } from "vitest";
import {
  ascomaTypeClassifierExample,
  ascomaTypeClassifierTool,
  runAscomaTypeClassifier,
} from "./tool.js";

describe("ascomaTypeClassifierTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAscomaTypeClassifier(ascomaTypeClassifierExample.input)).toEqual({
      ok: true,
      output: ascomaTypeClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(ascomaTypeClassifierExample))).toEqual(
      ascomaTypeClassifierExample,
    );
    expect(ascomaTypeClassifierTool.contractVersion).toBe(1);
    expect(ascomaTypeClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("passes through the apothecium type", () => {
    const r = runAscomaTypeClassifier({ type: "apothecium" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.ascomaClass).toBe("apothecium");
  });

  it("passes through the perithecium and cleistothecium types", () => {
    const peri = runAscomaTypeClassifier({ type: "perithecium" });
    const cleisto = runAscomaTypeClassifier({ type: "cleistothecium" });
    if (!peri.ok || !cleisto.ok) throw new Error("expected success");
    expect(peri.output.ascomaClass).toBe("perithecium");
    expect(cleisto.output.ascomaClass).toBe("cleistothecium");
  });

  it("passes through the hysterothecium type", () => {
    const r = runAscomaTypeClassifier({ type: "hysterothecium" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.ascomaClass).toBe("hysterothecium");
  });

  it("rejects unknown types", () => {
    expect(runAscomaTypeClassifier({ type: "basidiocarp" }).ok).toBe(false);
    expect(runAscomaTypeClassifier({ type: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runAscomaTypeClassifier(null).ok).toBe(false);
    expect(runAscomaTypeClassifier({ type: 42 }).ok).toBe(false);
    expect(
      runAscomaTypeClassifier({
        ...ascomaTypeClassifierExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
