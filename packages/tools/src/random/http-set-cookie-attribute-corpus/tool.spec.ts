import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  httpSetCookieAttributeCorpusExample as example,
  calculateHttpSetCookieAttributeCorpus,
} from "./tool.js";

describe("Random HTTP Set-Cookie Attribute Corpus Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateHttpSetCookieAttributeCorpus(example.input)).toEqual({
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
  it("preserves ordered attribute text and lowercase parser names across supported casing/subsets", () => {
    const result = tool.execute({
      ...example.input,
      caseCount: 32,
      minimumAttributes: 0,
      attributeNameCases: ["original", "lowercase", "uppercase"],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const entry of result.output.cases) {
      expect(entry.parsed.name).toBe(entry.cookie.name);
      expect(entry.parsed.value).toBe(entry.cookie.value);
      expect(entry.parsed.attributes).toEqual(
        entry.attributes.map(({ name, value }) => ({
          name: name.toLowerCase(),
          value,
        })),
      );
      const expiry = entry.parsed.attributes.find(
        (attribute) => attribute.name === "expires",
      );
      if (expiry) expect(expiry.value).toBe("Wed, 21 Oct 2037 07:28:00 GMT");
      expect(entry.header).not.toMatch(/[\r\n\x00]/);
    }
  });
  it("supports explicit Max-Age/SameSite/flag fixtures and a no-attribute control without browser-policy inference", () => {
    const result = tool.execute({
      ...example.input,
      attributePools: [
        { name: "Max-Age", values: ["-1", "0", "3600"] },
        { name: "SameSite", values: ["None", "Lax", "Strict"] },
        { name: "HttpOnly", values: [""] },
      ],
      minimumAttributes: 3,
      maximumAttributes: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.cases[0].parsed.attributes).toHaveLength(3);
    expect(
      tool.execute({
        ...example.input,
        attributePools: [],
        minimumAttributes: 0,
        maximumAttributes: 0,
      }),
    ).toMatchObject({
      ok: true,
      output: { cases: [{ attributes: [], parsed: { attributes: [] } }] },
    });
  });
  it("rejects controls/injection, duplicate pools, unsupported flag values, and impossible counts", () => {
    for (const attributePools of [
      [{ name: "Path", values: ["/\r\nX: y"] }],
      [{ name: "Expires", values: ["date; Secure"] }],
      [{ name: "Secure", values: ["true"] }],
      [{ name: "Max-Age", values: ["2.5"] }],
      [{ name: "SameSite", values: ["Other"] }],
      [
        { name: "Path", values: ["/"] },
        { name: "Path", values: ["/x"] },
      ],
    ])
      expect(
        tool.execute({
          ...example.input,
          attributePools,
          minimumAttributes: 0,
          maximumAttributes: 1,
        }),
      ).toMatchObject({ ok: false });
    for (const change of [
      { maximumAttributes: 4 },
      { minimumAttributes: 4 },
      { caseCount: 33 },
      { names: ["bad\n"] },
      { values: ["bad\n"] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
