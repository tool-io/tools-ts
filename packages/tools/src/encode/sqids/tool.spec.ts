import { describe, expect, it } from "vitest";
import { calculateDecodeSqids } from "../../decode/sqids/tool.js";
import { calculateEncodeSqids } from "./tool.js";

describe("Sqids tools", () => {
  it("round-trips an integer sequence", () => {
    const encoded = calculateEncodeSqids({ numbers: [1, 2, 3] });
    expect(encoded).toEqual({ ok: true, output: { id: "86Rf07" } });
    if (!encoded.ok) return;
    expect(calculateDecodeSqids({ id: encoded.output.id })).toEqual({
      ok: true,
      output: { numbers: [1, 2, 3] },
    });
  });
});
