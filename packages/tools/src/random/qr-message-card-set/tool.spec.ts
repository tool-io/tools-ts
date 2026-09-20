import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  qrMessageCardSetExample as example,
  calculateQrMessageCardSet,
} from "./tool.js";

describe("Random QR Message Card Set Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateQrMessageCardSet(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("expands only declared tokens, preserves original templates, and returns actual SVG symbols", () => {
    const result = tool.execute({
      ...example.input,
      templates: [
        "ID {{index}}/{{index}} code {{code}}; {{literal}}",
        "Unicode 😀 {{index}}",
      ],
      count: 6,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    result.output.cards.forEach((card, i) => {
      expect(card.index).toBe(i + 1);
      expect(card.randomCode).toMatch(/^[0-9]{6}$/);
      expect(card.payload).toBe(
        card.template
          .replaceAll("{{index}}", String(i + 1))
          .replaceAll("{{code}}", card.randomCode),
      );
      expect(card.symbol.bcid).toBe("qrcode");
      expect(card.symbol.svg).toContain("<svg");
      expect(card.symbol.width).toBeGreaterThan(0);
      expect(card.symbol.height).toBeGreaterThan(0);
      if (card.template.includes("{{literal}}"))
        expect(card.payload).toContain("{{literal}}");
    });
  });
  it("reports repeated constant payloads without claiming template tokens guarantee uniqueness", () => {
    const result = tool.execute({
      ...example.input,
      templates: ["same"],
      count: 3,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        duplicatePayloadPairs: [
          [1, 2],
          [1, 3],
          [2, 3],
        ],
      },
    });
    if (result.ok)
      expect(result.output.cards.map((card) => card.payload)).toEqual([
        "same",
        "same",
        "same",
      ]);
  });
  it("keeps capacity failures structured and rejects unsupported counts/options/templates", () => {
    expect(
      tool.execute({
        ...example.input,
        templates: ["\u0800".repeat(1024)],
        errorCorrection: "H",
        count: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "templates", code: "encoding_failed" }] },
    });
    for (const change of [
      { templates: [""] },
      { templates: ["x".repeat(1025)] },
      { count: 17 },
      { scale: 0 },
      { errorCorrection: "X" },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
