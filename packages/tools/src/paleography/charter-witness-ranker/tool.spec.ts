import { describe, expect, it } from "vitest";
import {
  charterWitnessRankerExample,
  runCharterWitnessRanker,
} from "./tool.js";

describe("charter-witness-ranker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCharterWitnessRanker(charterWitnessRankerExample.input)).toEqual({
      ok: true,
      output: charterWitnessRankerExample.output,
    });
  });

  it("classifies an abbess ahead of no titled witness", () => {
    expect(
      runCharterWitnessRanker({ witnesses: ["Matilda abbatissa", "Godric"] }),
    ).toEqual({
      ok: true,
      output: {
        witnessNames: ["Matilda abbatissa", "Godric"],
        ranks: [1, 2],
        precedenceClasses: ["ecclesiastical", "unspecified"],
      },
    });
  });

  it("rejects an empty witness list", () => {
    expect(runCharterWitnessRanker({ witnesses: [] }).ok).toBe(false);
    expect(runCharterWitnessRanker({ witnesses: ["   "] }).ok).toBe(false);
  });
});
