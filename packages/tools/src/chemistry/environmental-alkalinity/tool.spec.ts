import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  alkalinityExample,
  alkalinityTool,
  calculateAlkalinity,
} from "./tool.js";

describe("alkalinity", () => {
  it("reproduces the canonical example", () => {
    expect(calculateAlkalinity(alkalinityExample.input)).toEqual({
      ok: true,
      output: alkalinityExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(alkalinityTool)).toEqual([]);
  });

  it("allows a zero acid volume", () => {
    expect(
      calculateAlkalinity({
        ...alkalinityExample.input,
        acidVolumeMl: 0,
      }),
    ).toEqual({ ok: true, output: { alkalinityMgPerLAsCaCO3: 0 } });
  });
});
