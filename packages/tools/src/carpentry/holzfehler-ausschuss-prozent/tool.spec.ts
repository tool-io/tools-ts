import { describe, expect, it } from "vitest";
import { runWoodDefectWaste, woodDefectWasteExample } from "./tool.js";

describe("wood defect waste percentage calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWoodDefectWaste(woodDefectWasteExample.input)).toEqual({
      ok: true,
      output: woodDefectWasteExample.output,
    });
  });

  it("reports zero waste for a clean board", () => {
    expect(runWoodDefectWaste({ boardAreaM2: 3, defectAreaM2: 0 })).toEqual({
      ok: true,
      output: { defectWastePercent: 0 },
    });
  });

  it("accepts defects covering the whole board", () => {
    expect(runWoodDefectWaste({ boardAreaM2: 1.5, defectAreaM2: 1.5 })).toEqual(
      {
        ok: true,
        output: { defectWastePercent: 100 },
      },
    );
  });

  it("computes a quarter of the board", () => {
    expect(runWoodDefectWaste({ boardAreaM2: 2, defectAreaM2: 0.25 })).toEqual({
      ok: true,
      output: { defectWastePercent: 12.5 },
    });
  });

  it("computes three quarters of the board", () => {
    expect(runWoodDefectWaste({ boardAreaM2: 3, defectAreaM2: 0.75 })).toEqual({
      ok: true,
      output: { defectWastePercent: 25 },
    });
  });

  it("rejects defects larger than the board with the stable code", () => {
    const result = runWoodDefectWaste({
      boardAreaM2: 1,
      defectAreaM2: 1.01,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_defect_area");
  });

  it("rejects zero board area with the stable code", () => {
    const result = runWoodDefectWaste({ boardAreaM2: 0, defectAreaM2: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_board_area");
  });

  it("rejects negative board area with the stable code", () => {
    const result = runWoodDefectWaste({
      boardAreaM2: -2,
      defectAreaM2: 0.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_board_area");
  });

  it("rejects negative defect areas", () => {
    const result = runWoodDefectWaste({
      boardAreaM2: 2,
      defectAreaM2: -0.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires both areas", () => {
    expect(runWoodDefectWaste({ boardAreaM2: 2 }).ok).toBe(false);
  });

  it("rejects non-numeric areas", () => {
    const result = runWoodDefectWaste({
      boardAreaM2: 2,
      defectAreaM2: "0.5",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });
});
