import { describe, expect, it } from "vitest";
import {
  geologicTimeScaleLookupExample,
  runGeologicTimeScaleLookup,
} from "./tool.js";

describe("geologic-time-scale-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGeologicTimeScaleLookup(geologicTimeScaleLookupExample.input),
    ).toEqual({
      ok: true,
      output: geologicTimeScaleLookupExample.output,
    });
  });

  it("assigns the K-Pg boundary age to the younger period", () => {
    const result = runGeologicTimeScaleLookup({ ageMa: 66 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.period).toBe("Paleogene");
  });
  it("rejects ages older than the table range", () => {
    expect(runGeologicTimeScaleLookup({ ageMa: 1000 }).ok).toBe(false);
  });
});
