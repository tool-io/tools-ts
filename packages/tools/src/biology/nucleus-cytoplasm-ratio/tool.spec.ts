import { describe, expect, it } from "vitest";
import { runNucleusCytoplasmRatio } from "./tool.js";

describe("N:C Ratio", () => {
  it("calculates a valid result", () =>
    expect(
      runNucleusCytoplasmRatio({
        cytoplasmAreaUm2: 200,
        nucleusAreaUm2: 50,
      }),
    ).toEqual({
      ok: true,
      output: { nucleusCytoplasmRatio: 0.25 },
    }));
  it("allows a zero nucleus area", () =>
    expect(
      runNucleusCytoplasmRatio({
        cytoplasmAreaUm2: 200,
        nucleusAreaUm2: 0,
      }),
    ).toEqual({
      ok: true,
      output: { nucleusCytoplasmRatio: 0 },
    }));
  it("returns one for equal areas", () =>
    expect(
      runNucleusCytoplasmRatio({
        cytoplasmAreaUm2: 120,
        nucleusAreaUm2: 120,
      }),
    ).toEqual({
      ok: true,
      output: { nucleusCytoplasmRatio: 1 },
    }));
  it("rejects zero cytoplasm area", () => {
    const result = runNucleusCytoplasmRatio({
      cytoplasmAreaUm2: 0,
      nucleusAreaUm2: 50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_area");
  });
  it("rejects a negative nucleus area", () =>
    expect(
      runNucleusCytoplasmRatio({
        cytoplasmAreaUm2: 200,
        nucleusAreaUm2: -50,
      }).ok,
    ).toBe(false));
  it("rejects a negative cytoplasm area", () =>
    expect(
      runNucleusCytoplasmRatio({
        cytoplasmAreaUm2: -200,
        nucleusAreaUm2: 50,
      }).ok,
    ).toBe(false));
});
