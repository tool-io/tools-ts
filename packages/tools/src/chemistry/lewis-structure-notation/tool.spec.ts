import { describe, expect, it } from "vitest";
import { runLewisStructureNotation } from "./tool.js";

describe("Lewis Structure Notation Generator", () => {
  it("formats oxygen with 6 valence electrons", () => {
    expect(
      runLewisStructureNotation({ element: "O", valenceElectrons: 6 }),
    ).toEqual({
      ok: true,
      output: { notation: "[O......]" },
    });
  });

  it("rejects invalid input", () =>
    expect(runLewisStructureNotation(null).ok).toBe(false));
});
