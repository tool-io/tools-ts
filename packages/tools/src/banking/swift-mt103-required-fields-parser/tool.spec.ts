import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-9,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("normalizes CRLF, retains continuation fields and rejects mixed bare CR", () => {
    const full = example.input.normalizedMt103BlockFour + "\n:71A:SHA";
    expect(
      calculate({ normalizedMt103BlockFour: full.replace(/\n/g, "\r\n") })
        .requiredTagGroupsPresent,
    ).toBe(true);
    expect(
      tool.execute({
        normalizedMt103BlockFour: full
          .replace(":71A:SHA", ":71A:SHA\r")
          .replace(":23B", ":23B"),
      }),
    ).toMatchObject({ ok: false });
    expect(
      calculate({
        normalizedMt103BlockFour: full.replace(
          ":50K:TEST SENDER",
          ":50K:/001\nTEST SENDER",
        ),
      }).requiredTagGroupsPresent,
    ).toBe(true);
  });
  it("keeps blank required groups missing and rejects competing options", () => {
    expect(
      calculate({
        normalizedMt103BlockFour:
          example.input.normalizedMt103BlockFour + "\n:71A:",
      }).missingRequiredTagGroups,
    ).toEqual(["71A"]);
    expect(
      tool.execute({
        normalizedMt103BlockFour:
          example.input.normalizedMt103BlockFour + "\n:50A:AAAAUS00",
      }),
    ).toMatchObject({ ok: false });
  });
  it("preserves three-decimal currency amount text and bounds total amount length", () => {
    expect(
      calculate({
        normalizedMt103BlockFour:
          example.input.normalizedMt103BlockFour.replace(
            "USD100,00",
            "KWD1,234",
          ),
      }).amountDecimalText,
    ).toBe("1.234");
    expect(
      tool.execute({
        normalizedMt103BlockFour:
          example.input.normalizedMt103BlockFour.replace(
            "100,00",
            "12345678901234,12",
          ),
      }),
    ).toMatchObject({ ok: false });
    expect(
      tool.execute({ normalizedMt103BlockFour: "x".repeat(16385) }),
    ).toMatchObject({ ok: false });
  });
  it("computes independently specified canonical results", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects mistyped and nonfinite evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic and preserves caller evidence", () => {
    const input = JSON.parse(
        JSON.stringify(example.input),
      ) as typeof example.input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("rejects invalid domains and bounded resource requests", () => {
    const input = {
      ...example.input,
      normalizedMt103BlockFour:
        ":20:TESTREF\n:23B:CRED\n:32A:250101USD100,00\n:50K:TEST SENDER\n:59:TEST RECEIVER\n:20:DUPLICATE",
    };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = {
      ...example.input,
      normalizedMt103BlockFour:
        ":20:TESTREF\n:23B:CRED\n:32A:250101USD100,00\n:50K:TEST SENDER\n:59:TEST RECEIVER\n:71A:SHA",
    };
    close(calculate(input), {
      observedTagNames: ["20", "23B", "32A", "50K", "59", "71A"],
      missingRequiredTagGroups: [],
      requiredTagGroupsPresent: true,
      transactionReference: "TESTREF",
      valueDateYYMMDD: "250101",
      currencyCode: "USD",
      amountDecimalText: "100.00",
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        observedTagNames: ["20", "23B", "32A", "50K", "59", "71A"],
        missingRequiredTagGroups: [],
        requiredTagGroupsPresent: true,
        transactionReference: "TESTREF",
        valueDateYYMMDD: "250101",
        currencyCode: "USD",
        amountDecimalText: "100.00",
      });
  });
});
