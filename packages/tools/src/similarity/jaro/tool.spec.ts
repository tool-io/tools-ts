import { describe, expect, it } from "vitest";
import { calculateJaro, jaroExample, runJaro } from "./tool.js";

describe("similarity/jaro", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJaro(jaroExample.input)).toEqual({
      ok: true,
      output: jaroExample.output,
    });
  });

  it("matches the published dwayne/duane score", () => {
    expect(calculateJaro({ first: "dwayne", second: "duane" })).toEqual({
      matchingCharacters: 4,
      similarity: 0.8222222222222223,
      transpositions: 0,
    });
  });

  it("scores identical strings as one and disjoint strings as zero", () => {
    expect(calculateJaro({ first: "abc", second: "abc" })).toEqual({
      matchingCharacters: 3,
      similarity: 1,
      transpositions: 0,
    });
    expect(calculateJaro({ first: "aaa", second: "bbb" })).toEqual({
      matchingCharacters: 0,
      similarity: 0,
      transpositions: 0,
    });
  });

  it("treats two empty strings as identical and one empty string as disjoint", () => {
    expect(calculateJaro({ first: "", second: "" })).toEqual({
      matchingCharacters: 0,
      similarity: 1,
      transpositions: 0,
    });
    expect(calculateJaro({ first: "", second: "a" }).similarity).toBe(0);
  });

  it("respects the match window so distant characters do not pair", () => {
    expect(calculateJaro({ first: "aXXXX", second: "XXXXa" })).toEqual({
      matchingCharacters: 4,
      similarity: 0.8666666666666667,
      transpositions: 0,
    });
  });

  it("rejects overly long inputs", () => {
    expect(runJaro({ first: "x".repeat(2049), second: "x" })).toMatchObject({
      error: { issues: [{ code: "text_too_long" }] },
      ok: false,
    });
  });
});
