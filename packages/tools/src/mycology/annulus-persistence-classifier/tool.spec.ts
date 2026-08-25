import { describe, expect, it } from "vitest";
import {
  annulusPersistenceClassifierExample,
  annulusPersistenceClassifierTool,
  runAnnulusPersistenceClassifier,
} from "./tool.js";

describe("annulusPersistenceClassifierTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAnnulusPersistenceClassifier(
        annulusPersistenceClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: annulusPersistenceClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(annulusPersistenceClassifierExample)),
    ).toEqual(annulusPersistenceClassifierExample);
    expect(annulusPersistenceClassifierTool.contractVersion).toBe(1);
    expect(annulusPersistenceClassifierTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("passes through the persistent state", () => {
    const r = runAnnulusPersistenceClassifier({ persistence: "persistent" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.persistenceClass).toBe("persistent");
  });

  it("passes through the fugacious and evanescent states", () => {
    const fugacious = runAnnulusPersistenceClassifier({
      persistence: "fugacious",
    });
    const evanescent = runAnnulusPersistenceClassifier({
      persistence: "evanescent",
    });
    if (!fugacious.ok || !evanescent.ok) throw new Error("expected success");
    expect(fugacious.output.persistenceClass).toBe("fugacious");
    expect(evanescent.output.persistenceClass).toBe("evanescent");
  });

  it("passes through the absent state", () => {
    const r = runAnnulusPersistenceClassifier({ persistence: "absent" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.persistenceClass).toBe("absent");
  });

  it("rejects unknown states", () => {
    expect(
      runAnnulusPersistenceClassifier({ persistence: "membranous" }).ok,
    ).toBe(false);
    expect(runAnnulusPersistenceClassifier({ persistence: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runAnnulusPersistenceClassifier(null).ok).toBe(false);
    expect(runAnnulusPersistenceClassifier({ persistence: 1 }).ok).toBe(false);
    expect(
      runAnnulusPersistenceClassifier({
        ...annulusPersistenceClassifierExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
