import { describe, expect, it } from "vitest";
import {
  runSaltEfflorescenceClassifier,
  saltEfflorescenceClassifierExample,
} from "./tool.js";

describe("salt-efflorescence-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSaltEfflorescenceClassifier(saltEfflorescenceClassifierExample.input),
    ).toEqual({
      ok: true,
      output: saltEfflorescenceClassifierExample.output,
    });
  });

  it("defaults to surface efflorescence", () => {
    const result = runSaltEfflorescenceClassifier({});
    if (!result.ok) throw new Error("expected success");
    expect(result.output.classification as string).toBe("efflorescence");
    expect(result.output.definitionNote as string).toContain("efflorescence");
  });

  it("rejects an unknown location", () => {
    expect(
      runSaltEfflorescenceClassifier({ location: "interior" as "surface" }).ok,
    ).toBe(false);
  });
});
