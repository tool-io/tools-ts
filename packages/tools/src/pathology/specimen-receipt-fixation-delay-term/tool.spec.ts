import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pathology/specimen-receipt-fixation-delay-term", () => {
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
        collectionTime: 100,
        receiptTime: 150,
        recordedFixationStart: 140,
        collectionOffset: 0,
        receiptOffset: 0,
        fixationOffset: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        transit: 50,
        receiptToFixation: -10,
        collectionToFixation: 40,
        ordered: false,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite collectionTime",
    (value) =>
      expect(tool.execute({ ...example.input, collectionTime: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite receiptTime",
    (value) =>
      expect(tool.execute({ ...example.input, receiptTime: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite recordedFixationStart",
    (value) =>
      expect(
        tool.execute({ ...example.input, recordedFixationStart: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite collectionOffset",
    (value) =>
      expect(
        tool.execute({ ...example.input, collectionOffset: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite receiptOffset",
    (value) =>
      expect(tool.execute({ ...example.input, receiptOffset: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite fixationOffset",
    (value) =>
      expect(tool.execute({ ...example.input, fixationOffset: value }).ok).toBe(
        false,
      ),
  );
});
