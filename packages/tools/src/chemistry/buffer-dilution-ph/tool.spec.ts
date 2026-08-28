import { describe, expect, it } from "vitest";
import { runBufferDilutionPh } from "./tool.js";
describe("Buffer Dilution pH Calculator", () => {
  it("pH unchanged on dilution", () => {
    expect(
      runBufferDilutionPh({ dilutionFactor: 10, initialPh: 4.76 }),
    ).toEqual({ ok: true, output: { finalPh: 4.76 } });
  });
  it("rejects invalid input", () =>
    expect(runBufferDilutionPh(null).ok).toBe(false));
});
