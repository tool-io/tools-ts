import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateNuclearQValue,
  nuclearQValueExample,
  nuclearQValueTool,
} from "./tool.js";

describe("nuclear Q value", () => {
  it("reproduces the canonical example", () => {
    expect(calculateNuclearQValue(nuclearQValueExample.input)).toEqual({
      ok: true,
      output: nuclearQValueExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(nuclearQValueTool)).toEqual([]);
  });

  it("returns a negative value when final mass is greater", () => {
    const result = calculateNuclearQValue({ finalMassKg: 2, initialMassKg: 1 });
    expect(result).toMatchObject({ ok: true });
    if (result.ok) expect(result.output.qValueJ).toBeLessThan(0);
  });
});
