import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, rowHashDigestMd5StyleDedupeKeyInputSchema, rowHashDigestMd5StyleDedupeKeyOutputSchema } from "./index.js";
describe("csv/row-hash-digest-md5-style-dedupe-key", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, rowHashDigestMd5StyleDedupeKeyInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, rowHashDigestMd5StyleDedupeKeyOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "cells": [
        "a,b",
        "c"
      ]
    })).toEqual({ ok: true, output: {
      "digest": "0127bc1aea27b518fe54fbd104b52f83"
    } });
    expect(tool.execute({
      "cells": [
        "a",
        "b,c"
      ]
    })).toEqual({ ok: true, output: {
      "digest": "f679f085c639a8170286f9abccce5118"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "cells": []
    })).toEqual({ ok: true, output: {
      "digest": "d751713988987e9331980363e24189ce"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "cells", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
