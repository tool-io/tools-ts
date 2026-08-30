import { describe, expect, it } from "vitest";
import { calculateParseUuid } from "../parse/uuid/tool.js";
import { calculateValidateUuid } from "../validate/uuid/tool.js";

describe("UUID inspection tools", () => {
  it("parses version and RFC variant", () => {
    const result = calculateParseUuid({
      uuid: "550E8400-E29B-41D4-A716-446655440000",
    });
    expect(result.ok && result.output).toMatchObject({
      normalized: "550e8400-e29b-41d4-a716-446655440000",
      kind: "random-v4",
      variant: "rfc-9562",
      version: 4,
    });
  });

  it("identifies every standardized UUID kind plus Nil and Max", () => {
    const cases = [
      ["00000000-0000-0000-0000-000000000000", "nil"],
      ["00000000-0000-1000-8000-000000000000", "time-based-v1"],
      ["00000000-0000-2000-8000-000000000000", "dce-security-v2"],
      ["00000000-0000-3000-8000-000000000000", "name-based-md5-v3"],
      ["00000000-0000-4000-8000-000000000000", "random-v4"],
      ["00000000-0000-5000-8000-000000000000", "name-based-sha1-v5"],
      ["00000000-0000-6000-8000-000000000000", "reordered-time-v6"],
      ["00000000-0000-7000-8000-000000000000", "unix-time-v7"],
      ["00000000-0000-8000-8000-000000000000", "custom-v8"],
      ["ffffffff-ffff-ffff-ffff-ffffffffffff", "max"],
    ] as const;
    for (const [uuid, kind] of cases) {
      expect(calculateParseUuid({ uuid })).toMatchObject({
        ok: true,
        output: { kind },
      });
    }
  });

  it("reports invalid UUID text as a validation result", () => {
    expect(calculateValidateUuid({ uuid: "not-a-uuid" })).toEqual({
      ok: true,
      output: { normalized: "", valid: false, version: 0 },
    });
  });
});
