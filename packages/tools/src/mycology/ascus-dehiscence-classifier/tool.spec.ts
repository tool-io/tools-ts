import { describe, expect, it } from "vitest";
import {
  ascusDehiscenceClassifierExample,
  ascusDehiscenceClassifierTool,
  runAscusDehiscenceClassifier,
} from "./tool.js";

describe("ascusDehiscenceClassifierTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAscusDehiscenceClassifier(ascusDehiscenceClassifierExample.input),
    ).toEqual({
      ok: true,
      output: ascusDehiscenceClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(ascusDehiscenceClassifierExample)),
    ).toEqual(ascusDehiscenceClassifierExample);
    expect(ascusDehiscenceClassifierTool.contractVersion).toBe(1);
    expect(ascusDehiscenceClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("passes through the operculate mode", () => {
    const r = runAscusDehiscenceClassifier({ mode: "operculate" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.dehiscenceClass).toBe("operculate");
  });

  it("passes through the bitunicate mode", () => {
    const r = runAscusDehiscenceClassifier({ mode: "bitunicate" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.dehiscenceClass).toBe("bitunicate");
  });

  it("passes through the inoperculate and prototunicate modes", () => {
    const inoperculate = runAscusDehiscenceClassifier({
      mode: "inoperculate",
    });
    const prototunicate = runAscusDehiscenceClassifier({
      mode: "prototunicate",
    });
    if (!inoperculate.ok || !prototunicate.ok)
      throw new Error("expected success");
    expect(inoperculate.output.dehiscenceClass).toBe("inoperculate");
    expect(prototunicate.output.dehiscenceClass).toBe("prototunicate");
  });

  it("rejects unknown modes", () => {
    expect(runAscusDehiscenceClassifier({ mode: "schizogenous" }).ok).toBe(
      false,
    );
    expect(runAscusDehiscenceClassifier({ mode: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runAscusDehiscenceClassifier(null).ok).toBe(false);
    expect(runAscusDehiscenceClassifier({ mode: 3 }).ok).toBe(false);
    expect(
      runAscusDehiscenceClassifier({
        ...ascusDehiscenceClassifierExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
