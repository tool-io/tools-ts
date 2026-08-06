import { describe, expect, it } from "vitest";
import {
  demonstrateSkiRental,
  runSkiRental,
  skiRentalExample,
} from "./tool.js";

describe("Ski-Rental Algorithm", () => {
  it("rents before the break-even day", () =>
    expect(demonstrateSkiRental(10, 100, 5).decision).toBe("rent"));
  it("buys at the break-even day", () =>
    expect(demonstrateSkiRental(10, 100, 10).decision).toBe("buy on day 10"));
  it("publishes an executable example", () =>
    expect(runSkiRental(skiRentalExample.input)).toEqual({
      ok: true,
      output: skiRentalExample.output,
    }));
});
