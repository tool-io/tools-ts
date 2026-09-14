import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { encodedText: "​‌​​​​​‌" } };
const close = (a: unknown, e: unknown): void => {
  if (typeof e === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - e)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(e)) * 1e-9,
    );
  } else if (Array.isArray(e)) {
    expect(Array.isArray(a)).toBe(true);
    expect((a as unknown[]).length).toBe(e.length);
    e.forEach((v, j) => close((a as unknown[])[j], v));
  } else if (e && typeof e === "object") {
    expect(Object.keys(a as object).sort()).toEqual(Object.keys(e).sort());
    for (const [k, v] of Object.entries(e))
      close((a as Record<string, unknown>)[k], v);
  } else expect(a).toEqual(e);
};
describe(tool.id, () => {
  it("matches independently specified fixture through both entrypoints", () => {
    close(calculate(example.input), expected);
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, expected);
  });
  it("publishes contract and matching schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("requires own fields and rejects extras", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
  });
  it("rejects null and nonfinite observations", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(() =>
          calculate({ ...example.input, [k]: NaN } as Input),
        ).toThrow();
        expect(() =>
          calculate({ ...example.input, [k]: Infinity } as Input),
        ).toThrow();
      }
      if (Array.isArray(v)) {
        expect(() =>
          calculate({ ...example.input, [k]: Array(1) } as Input),
        ).toThrow();
      }
    }
  });
  it("is deterministic without mutating observations", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(x);
    close(calculate(x), expected);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(before);
  });
  it("rejects explicitly unsupported evidence", () => {
    const x = { ...example.input, ...{ payloadHex: "g0" } } as unknown as Input;
    expect(() => calculate(x)).toThrow();
    expect(tool.execute(x)).toMatchObject({ ok: false });
  });
  it("rejects inherited and oversized array slots", () => {
    for (const [k, v] of Object.entries(example.input))
      if (Array.isArray(v)) {
        const a = Array(1);
        Object.setPrototypeOf(
          a,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() =>
          calculate({ ...example.input, [k]: a } as Input),
        ).toThrow();
        const huge =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: huge })).toMatchObject({
          ok: false,
        });
      }
  });
  it("retains declared boundary, signed, tied or unknown evidence", () =>
    close(
      calculate({
        ...example.input,
        ...{ payloadHex: "" },
      } as unknown as Input),
      { result: { encodedText: "" } },
    ));
});

// batch52 domain regressions

import { calculate as decodeBytes } from "../zero-width-character-stego-decode/tool.js";
it.each(["", "00", "ff", "000141ff", "AbCd", "00".repeat(128)])(
  "round-trips complete bytes %s",
  (payloadHex) =>
    expect(
      decodeBytes({
        encodedText: calculate({ payloadHex }).result.encodedText as string,
      }).result.payloadHex,
    ).toBe(payloadHex.toLowerCase()),
);
it.each(["0", "gg", "41\n", "00".repeat(129)])(
  "rejects malformed byte payload %s",
  (payloadHex) => expect(() => calculate({ payloadHex })).toThrow(),
);
it.each(["\u200b", "\u200b".repeat(7), "\u200b".repeat(9), "x".repeat(8)])(
  "rejects partial or normalized stego bytes",
  (encodedText) => expect(() => decodeBytes({ encodedText })).toThrow(),
);
