import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import { toolResourceLimits } from "../../core/limits.js";
import { example } from "./example.js";
import { digitCountTool, runDigitCount } from "./tool.js";
describe("Digit Count Calculator", () => {
  it.each([
    [-1204, 4],
    [0, 1],
    [-0, 1],
    [Number.MAX_SAFE_INTEGER, 16],
    [Number.MIN_SAFE_INTEGER, 16],
    ["1234567890123456", 16],
    ["12345678901234567", 17],
    ["99999999999999999", 17],
    ["100000000000000000000", 21],
    ["123456789012345678901234567890", 30],
    ["-123456789012345678901234567890", 30],
    ["+123456789012345678901234567890", 30],
    ["0001204", 4],
    ["-0001204", 4],
    ["0", 1],
    ["00000", 1],
    ["-00000", 1],
    ["+0", 1],
    ["9".repeat(1000), 1000],
  ])("counts %s without numeric precision loss", (value, digits) => {
    expect(matchesToolJsonSchema({ value }, digitCountTool.inputSchema)).toBe(
      true,
    );
    expect(runDigitCount({ value })).toEqual({
      ok: true,
      output: { digits },
    });
  });

  it.each([
    "",
    "+",
    "-",
    "1.5",
    "1e20",
    "1,000",
    "0x10",
    "12a",
    "１２３",
    " 123",
    "123 ",
    "123\n",
    "1\n2",
    1.5,
    1e16,
    1e21,
    NaN,
    Infinity,
    -Infinity,
    null,
    true,
    [],
    {},
  ])("rejects invalid or already-rounded integer input %s", (value) => {
    expect(matchesToolJsonSchema({ value }, digitCountTool.inputSchema)).toBe(
      false,
    );
    expect(runDigitCount({ value })).toMatchObject({ ok: false });
  });

  it("advertises a text field so long UI values are not parsed as JavaScript numbers", () => {
    expect(digitCountTool.ports.inputs[0]?.valueType.type).toBe("string");
  });

  it("provides a useful error for unsafe numeric callers", () => {
    expect(runDigitCount({ value: 1e16 })).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "value", message: expect.stringContaining("use text") },
        ],
      },
    });
  });

  it("accepts the text resource limit and rejects larger input", () => {
    expect(
      runDigitCount({ value: "9".repeat(toolResourceLimits.textCharacters) }),
    ).toEqual({
      ok: true,
      output: { digits: toolResourceLimits.textCharacters },
    });
    const input = { value: "9".repeat(toolResourceLimits.textCharacters + 1) };
    expect(matchesToolJsonSchema(input, digitCountTool.inputSchema)).toBe(
      false,
    );
    expect(runDigitCount(input).ok).toBe(false);
  });

  it("publishes a valid contract and an executable long-integer example", () => {
    expect(validateToolContract(digitCountTool)).toEqual([]);
    expect(
      matchesToolJsonSchema(example.input, digitCountTool.inputSchema),
    ).toBe(true);
    expect(
      matchesToolJsonSchema(example.output, digitCountTool.outputSchema),
    ).toBe(true);
    expect(runDigitCount(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("rejects missing, non-object and unknown-field input", () => {
    for (const input of [null, [], {}, { value: "123", unknown: true }])
      expect(runDigitCount(input).ok).toBe(false);
  });
});
