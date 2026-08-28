import { describe, expect, it } from "vitest";
import { runElectronConfiguration } from "./tool.js";

describe("Electron Configuration Generator", () => {
  it("calculates a valid result", () => {
    expect(runElectronConfiguration({ atomicNumber: 1 })).toEqual({
      ok: true,
      output: { configuration: "1s¹" },
    });
    expect(runElectronConfiguration({ atomicNumber: 8 })).toEqual({
      ok: true,
      output: { configuration: "1s²2s²2p⁴" },
    });
    expect(runElectronConfiguration({ atomicNumber: 26 })).toEqual({
      ok: true,
      output: {
        configuration: "1s²2s²2p⁶3s²3p⁶4s²3d⁶",
      },
    });
    expect(runElectronConfiguration({ atomicNumber: 24 })).toEqual({
      ok: true,
      output: { configuration: "1s²2s²2p⁶3s²3p⁶4s¹3d⁵" },
    });
    expect(runElectronConfiguration({ atomicNumber: 46 })).toEqual({
      ok: true,
      output: { configuration: "1s²2s²2p⁶3s²3p⁶4s²3d¹⁰4p⁶4d¹⁰" },
    });
  });

  it("rejects invalid input", () =>
    expect(runElectronConfiguration(null).ok).toBe(false));
});
