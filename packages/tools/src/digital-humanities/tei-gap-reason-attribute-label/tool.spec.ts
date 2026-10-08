import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("digital-humanities/tei-gap-reason-attribute-label", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(tool.execute({ suppliedReason: "lost & damaged" })).toEqual({
      ok: true,
      output: { attributeText: 'reason="lost &amp; damaged"' },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
});

describe("reviewed boundary cases", () => {
  it.each(["suppliedReason"])(
    "rejects empty required text with its field",
    (field) => {
      expect(tool.execute({ ...example.input, [field]: "" })).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field, code: "invalid_field" }],
        },
      });
    },
  );
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ suppliedReason: 'lost & <cut> "A"' },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { attributeText: 'reason="lost &amp; &lt;cut> &quot;A&quot;"' },
    });
    expect(calculate(input)).toEqual({
      attributeText: 'reason="lost &amp; &lt;cut> &quot;A&quot;"',
    });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = { ...example.input, ...{ suppliedReason: "😀" } };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { attributeText: 'reason="😀"' },
    });
    expect(calculate(input)).toEqual({ attributeText: 'reason="😀"' });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ suppliedReason: "\ud800" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "suppliedReason", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ suppliedReason: "￿" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "suppliedReason", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ suppliedReason: "a\nb" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "suppliedReason", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
