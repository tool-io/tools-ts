import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bioinformatics/fasta-accession-version-suffix", () => {
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
    expect(tool.execute({ accessionToken: "seq_local" })).toEqual({
      ok: true,
      output: {
        accession: "seq_local",
        versionText: "",
        hasNumericVersion: false,
      },
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
  it.each(["accessionToken"])(
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
    const input = { ...example.input, ...{ accessionToken: "seq.0002" } };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        accession: "seq",
        versionText: "0002",
        hasNumericVersion: true,
      },
    });
    expect(calculate(input)).toEqual({
      accession: "seq",
      versionText: "0002",
      hasNumericVersion: true,
    });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ accessionToken: "seq 2" } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "accessionToken", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
