import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateHardnessCaco3,
  hardnessCaco3Example,
  hardnessCaco3Tool,
} from "./tool.js";

describe("hardness as CaCO3", () => {
  it("reproduces the canonical example", () => {
    expect(calculateHardnessCaco3(hardnessCaco3Example.input)).toEqual({
      ok: true,
      output: hardnessCaco3Example.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(hardnessCaco3Tool)).toEqual([]);
  });

  it("accepts zero concentration for either ion", () => {
    expect(
      calculateHardnessCaco3({ calciumMgPerL: 0, magnesiumMgPerL: 0 }),
    ).toEqual({ ok: true, output: { hardnessMgPerLAsCaCO3: 0 } });
  });
});
