import { describe, expect, it } from "vitest";
import { validateToolContract } from "../core/contract.js";

const tools = {
  "bitwise/and": await import("./and/tool.js"),
  "bitwise/or": await import("./or/tool.js"),
  "bitwise/xor": await import("./xor/tool.js"),
  "bitwise/not": await import("./not/tool.js"),
  "bitwise/left-shift": await import("./left-shift/tool.js"),
  "bitwise/right-shift": await import("./right-shift/tool.js"),
} as const;

describe("Bitwise family", () => {
  for (const [id, module] of Object.entries(tools)) {
    it(`${id} publishes a valid contract and executes its example`, () => {
      const tool = module.default;
      expect(tool.id).toBe(id);
      expect(validateToolContract(tool)).toEqual([]);
      expect(module.example).toBeDefined();
      const result = tool.execute(module.example.input);
      expect(result).toEqual({ ok: true, output: module.example.output });
    });
  }

  it("computes and/or/xor/not on 32-bit forms", () => {
    expect(tools["bitwise/and"].default.execute({ a: 12, b: 10 })).toEqual({
      ok: true,
      output: { result: 8 },
    });
    expect(tools["bitwise/or"].default.execute({ a: 12, b: 10 })).toEqual({
      ok: true,
      output: { result: 14 },
    });
    expect(tools["bitwise/xor"].default.execute({ a: 12, b: 10 })).toEqual({
      ok: true,
      output: { result: 6 },
    });
    expect(tools["bitwise/not"].default.execute({ a: 0 })).toEqual({
      ok: true,
      output: { result: -1 },
    });
  });

  it("shifts with sign preservation and rejects out-of-range shifts", () => {
    expect(
      tools["bitwise/left-shift"].default.execute({ a: 3, shift: 4 }),
    ).toEqual({ ok: true, output: { result: 48 } });
    expect(
      tools["bitwise/right-shift"].default.execute({ a: -16, shift: 2 }),
    ).toEqual({ ok: true, output: { result: -4 } });
    expect(
      tools["bitwise/right-shift"].default.execute({ a: -16, shift: 32 }),
    ).toMatchObject({ ok: false });
    expect(
      tools["bitwise/and"].default.execute({ a: 2147483648, b: 1 }),
    ).toMatchObject({ ok: false });
  });
});
