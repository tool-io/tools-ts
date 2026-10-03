import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("set/nested-set-element-versus-subset-label", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("matches its canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independently specified boundary or alternate case", () => {
    expect(tool.execute({ candidateJson: "[1]", setJson: "[[1],2]" })).toEqual({
      ok: true,
      output: { element: true, subset: false },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    { ...example.input, candidateJson: null },
  ])("rejects malformed input %j", (input) => {
    const result = tool.execute(input);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_input");
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});

it("treats nested sets as unordered and ignores repeated members", () => {
  expect(
    tool.execute({ candidateJson: "[1,2,2]", setJson: "[[2,1]]" }),
  ).toEqual({ ok: true, output: { element: true, subset: false } });
});

it("rejects objects as unsupported set atoms", () => {
  expect(tool.execute({ candidateJson: "{}", setJson: "[{}]" }).ok).toBe(false);
});
