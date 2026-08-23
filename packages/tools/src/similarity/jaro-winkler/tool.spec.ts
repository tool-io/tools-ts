import { describe, expect, it } from "vitest";
import {
  calculateJaroWinkler,
  jaroWinklerExample,
  runJaroWinkler,
} from "./tool.js";

describe("similarity/jaro-winkler", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJaroWinkler(jaroWinklerExample.input)).toEqual({
      ok: true,
      output: jaroWinklerExample.output,
    });
  });

  it("boosts a shared prefix of dwayne/duane by one step", () => {
    expect(calculateJaroWinkler({ first: "dwayne", second: "duane" })).toEqual({
      commonPrefixLength: 1,
      jaroSimilarity: 0.8222222222222223,
      similarity: 0.8400000000000001,
    });
  });

  it("caps the prefix bonus at four characters", () => {
    const output = calculateJaroWinkler({
      first: "abcdefgh",
      second: "abcdefxy",
    });
    expect(output.commonPrefixLength).toBe(4);
    expect(output.jaroSimilarity).toBeGreaterThan(0.7);
    expect(output.similarity).toBe(
      output.jaroSimilarity + 0.4 * (1 - output.jaroSimilarity),
    );
  });

  it("skips the bonus when Jaro similarity is at most 0.7", () => {
    const output = calculateJaroWinkler({ first: "ABCDEF", second: "XXXXXX" });
    expect(output).toEqual({
      commonPrefixLength: 0,
      jaroSimilarity: 0,
      similarity: 0,
    });
  });

  it("leaves low-Jaro pairs with a prefix unboosted", () => {
    const output = calculateJaroWinkler({
      first: "abzzzzzz",
      second: "abyyyyyy",
    });
    expect(output.jaroSimilarity).toBeLessThanOrEqual(0.7);
    expect(output.similarity).toBe(output.jaroSimilarity);
  });

  it("scores identical and empty inputs consistently with Jaro", () => {
    expect(calculateJaroWinkler({ first: "same", second: "same" })).toEqual({
      commonPrefixLength: 4,
      jaroSimilarity: 1,
      similarity: 1,
    });
    expect(calculateJaroWinkler({ first: "", second: "" }).similarity).toBe(1);
  });
});
