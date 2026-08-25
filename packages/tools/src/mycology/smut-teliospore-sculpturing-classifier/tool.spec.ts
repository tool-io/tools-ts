import { describe, expect, it } from "vitest";
import { runSmutTeliosporeSculpturingClassifier } from "./tool.js";
describe("Teliospore Sculpturing", () => {
  it("classifies echinulate spores", () =>
    expect(
      runSmutTeliosporeSculpturingClassifier({ sculpturing: "echinulate" }),
    ).toEqual({ ok: true, output: { sculpturingClass: "echinulate" } }));
  it("classifies verrucose spores", () =>
    expect(
      runSmutTeliosporeSculpturingClassifier({ sculpturing: "verrucose" }),
    ).toEqual({ ok: true, output: { sculpturingClass: "verrucose" } }));
  it("classifies smooth spores", () =>
    expect(
      runSmutTeliosporeSculpturingClassifier({ sculpturing: "smooth" }),
    ).toEqual({ ok: true, output: { sculpturingClass: "smooth" } }));
  it("classifies reticulate spores", () =>
    expect(
      runSmutTeliosporeSculpturingClassifier({ sculpturing: "reticulate" }),
    ).toEqual({ ok: true, output: { sculpturingClass: "reticulate" } }));
  it("accepts every supported class", () => {
    for (const sculpturing of [
      "echinulate",
      "verrucose",
      "smooth",
      "reticulate",
    ])
      expect(runSmutTeliosporeSculpturingClassifier({ sculpturing }).ok).toBe(
        true,
      );
  });
  it("rejects unsupported sculpturing", () =>
    expect(
      runSmutTeliosporeSculpturingClassifier({ sculpturing: "tuberculate" }).ok,
    ).toBe(false));
  it("rejects empty sculpturing", () =>
    expect(runSmutTeliosporeSculpturingClassifier({ sculpturing: "" }).ok).toBe(
      false,
    ));
});
