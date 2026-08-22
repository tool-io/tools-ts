import { describe, expect, it } from "vitest";
import {
  runwaySlopeCorrectionExample,
  runRunwaySlopeCorrection,
} from "./tool.js";
describe("runway slope correction calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runRunwaySlopeCorrection(runwaySlopeCorrectionExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.correctedDistanceFt).toBe(2200);
  });
});
