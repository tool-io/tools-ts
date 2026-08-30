import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateCorsAllowOriginChecker, example } from "./tool.js";

describe("web/cors-allow-origin-checker", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateCorsAllowOriginChecker(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing input", () => {
    expect(tool.execute({}).ok).toBe(false);
  });
  it("handles representative case 1", () => {
    expect(
      tool.execute({
        requestOrigin: "https://example.com",
        allowOrigin: "*",
        credentialsIncluded: false,
      }),
    ).toEqual({ ok: true, output: { allowed: true } });
  });
  it("handles representative case 2", () => {
    expect(
      tool.execute({
        requestOrigin: "https://example.com",
        allowOrigin: "*",
        credentialsIncluded: true,
      }),
    ).toEqual({ ok: true, output: { allowed: false } });
  });
});
