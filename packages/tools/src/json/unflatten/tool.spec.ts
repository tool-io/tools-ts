import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateJsonUnflatten,
  jsonUnflattenExample,
  jsonUnflattenTool,
} from "./tool.js";

describe("JSON Unflatten", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = jsonUnflattenTool.execute(jsonUnflattenExample.input);
    expect(result).toEqual({ ok: true, output: jsonUnflattenExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(jsonUnflattenTool.id).toBe("json/unflatten");
    expect(validateToolContract(jsonUnflattenTool)).toEqual([]);
  });

  it("round-trips with the flatten tool", async () => {
    const flatten = await import("../flatten/tool.js");
    const original = { list: ["a", "b"], meta: { ok: true } };
    const flat = flatten.default.execute({ document: original });
    expect(flat.ok).toBe(true);
    if (!flat.ok) return;
    const rebuilt = calculateJsonUnflatten({
      flat: flat.output.flat as never,
    });
    expect(rebuilt.ok).toBe(true);
    if (rebuilt.ok) expect(rebuilt.output.document).toEqual(original);
  });

  it("rejects conflicting paths and non-leaf values", () => {
    expect(
      calculateJsonUnflatten({ flat: { a: 1, "a.b": 2 } }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateJsonUnflatten({ flat: { bad: [1, 2] } }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(calculateJsonUnflatten(null)).toMatchObject({
      error: { code: "invalid_input" },
    });
  });
});
