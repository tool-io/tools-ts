import { describe, expect, it } from "vitest";
import {
  blackScholesExample,
  blackScholesPrice,
  runBlackScholes,
} from "./tool.js";

describe("Black-Scholes", () => {
  it("prices calls and puts", () => {
    expect(blackScholesPrice(100, 100, 1, 0.05, 0.2, "call")).toBe(10.450575);
    expect(blackScholesPrice(100, 100, 1, 0.05, 0.2, "put")).toBe(5.573518);
  });
  it("rejects nonpositive prices", () =>
    expect(runBlackScholes({ ...blackScholesExample.input, spot: 0 }).ok).toBe(
      false,
    ));
  it("publishes an executable example", () =>
    expect(runBlackScholes(blackScholesExample.input)).toEqual({
      ok: true,
      output: blackScholesExample.output,
    }));
});
