import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("network/tcp-sack-duplicate-block-order-classifier", () => {
  it("does not classify an empty block as duplicate data", () => {
    expect(
      calculate({ firstLeft: 100, firstRight: 100, cumulativeAck: 150 }),
    ).toEqual({ belowAck: false, validBlock: false });
  });
  it("handles a valid block across sequence wrap", () => {
    expect(
      tool.execute({ firstLeft: 4294967280, firstRight: 0, cumulativeAck: 0 }),
    ).toEqual({ ok: true, output: { belowAck: true, validBlock: true } });
  });
  it("does not order a left endpoint outside the unambiguous half range", () => {
    expect(
      calculate({
        firstLeft: 2147483641,
        firstRight: 2147483640,
        cumulativeAck: 2147483650,
      }),
    ).toEqual({ belowAck: false, validBlock: false });
    expect(
      calculate({ firstLeft: 2147483657, firstRight: 8, cumulativeAck: 18 }),
    ).toEqual({ belowAck: false, validBlock: true });
  });
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
      tool.execute({ firstLeft: 160, firstRight: 180, cumulativeAck: 150 }),
    ).toEqual({ ok: true, output: { belowAck: false, validBlock: true } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstLeft", (value) =>
    expect(tool.execute({ ...example.input, firstLeft: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite firstRight", (value) =>
    expect(tool.execute({ ...example.input, firstRight: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cumulativeAck",
    (value) =>
      expect(tool.execute({ ...example.input, cumulativeAck: value }).ok).toBe(
        false,
      ),
  );
});
