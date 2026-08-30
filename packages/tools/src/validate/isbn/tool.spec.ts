import { describe, expect, it } from "vitest";
import { calculateValidateIsbn } from "./tool.js";

describe("ISBN validator", () => {
  it("validates and converts ISBN-10 and ISBN-13", () => {
    expect(calculateValidateIsbn({ isbn: "0-306-40615-2" })).toMatchObject({
      ok: true,
      output: { isbn13: "9780306406157", valid: true },
    });
    expect(calculateValidateIsbn({ isbn: "978-0-306-40615-7" })).toMatchObject({
      ok: true,
      output: { isbn10: "0306406152", valid: true },
    });
    expect(calculateValidateIsbn({ isbn: "9780306406158" })).toMatchObject({
      ok: true,
      output: { valid: false },
    });
    expect(calculateValidateIsbn({ isbn: "4006381333931" })).toMatchObject({
      ok: true,
      output: { valid: false },
    });
    expect(calculateValidateIsbn({ isbn: "9790230671187" })).toMatchObject({
      ok: true,
      output: { valid: false },
    });
  });
});
