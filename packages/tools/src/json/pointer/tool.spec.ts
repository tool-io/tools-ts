import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateJsonPointer,
  jsonPointerExample,
  jsonPointerTool,
} from "./tool.js";

describe("JSON Pointer Resolver", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = jsonPointerTool.execute(jsonPointerExample.input);
    expect(result).toEqual({ ok: true, output: jsonPointerExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(jsonPointerTool.id).toBe("json/pointer");
    expect(validateToolContract(jsonPointerTool)).toEqual([]);
  });

  it("respects ~0 and ~1 escapes", () => {
    const result = calculateJsonPointer({
      document: { "a/b": 1, "m~n": 2 },
      pointer: "/a~1b",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.valueJson).toBe("1");
    const tilde = calculateJsonPointer({
      document: { "a/b": 1, "m~n": 2 },
      pointer: "/m~0n",
    });
    expect(tilde.ok).toBe(true);
    if (tilde.ok) expect(tilde.output.valueJson).toBe("2");
  });

  it("reports not-found without failing", () => {
    const missing = calculateJsonPointer({
      document: { a: [1] },
      pointer: "/a/5",
    });
    expect(missing).toEqual({
      ok: true,
      output: { found: false, valueJson: null },
    });
    const root = calculateJsonPointer({
      document: { a: 1 },
      pointer: "",
    });
    expect(root).toEqual({
      ok: true,
      output: { found: true, valueJson: '{"a":1}' },
    });
  });

  it("rejects malformed pointers", () => {
    expect(
      calculateJsonPointer({ document: {}, pointer: "a" }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(calculateJsonPointer(null)).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateJsonPointer({ extra: 1 })).toMatchObject({
      error: { code: "invalid_input" },
    });
  });
});
