import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("data-science/cross-validation-purge-window-overlap", () => {
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
    expect(
      tool.execute({
        labelStart: 8,
        labelEnd: 10,
        validationStart: 4,
        validationEnd: 8,
        embargo: 0,
      }),
    ).toEqual({ ok: true, output: { overlap: false } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite labelStart", (value) =>
    expect(tool.execute({ ...example.input, labelStart: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite labelEnd", (value) =>
    expect(tool.execute({ ...example.input, labelEnd: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite validationStart",
    (value) =>
      expect(
        tool.execute({ ...example.input, validationStart: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite validationEnd",
    (value) =>
      expect(tool.execute({ ...example.input, validationEnd: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite embargo", (value) =>
    expect(tool.execute({ ...example.input, embargo: value }).ok).toBe(false),
  );
  it.each([{ labelEnd: 0 }, { embargo: -1 }, { embargo: -1 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
  it("keeps empty half-open label and validation windows disjoint", () => {
    expect(
      calculate({
        labelStart: 5,
        labelEnd: 5,
        validationStart: 4,
        validationEnd: 8,
        embargo: 0,
      }),
    ).toEqual({ overlap: false });
    expect(
      calculate({
        labelStart: 1,
        labelEnd: 8,
        validationStart: 4,
        validationEnd: 4,
        embargo: 0,
      }),
    ).toEqual({ overlap: false });
  });
  it.each([{ labelEnd: 0 }, { embargo: -1 }, { embargo: -1 }])(
    "reviewed-domain direct validation %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrow();
      const result = tool.execute({ ...example.input, ...change });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect([
          "invalid_field",
          "invalid_domain",
          "result_out_of_range",
        ]).toContain(result.error.issues[0].code);
    },
  );
});
