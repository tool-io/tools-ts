import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("evolutionary-biology/out-group-root-side-flag", () => {
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
        outgroupTipIds: ["A", "D"],
        firstSideTipIds: ["A", "B"],
        secondSideTipIds: ["D"],
      }),
    ).toEqual({
      ok: true,
      output: { allOnFirst: false, allOnSecond: false, splitAcrossSides: true },
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

describe("batch 77 reviewed regressions", () => {
  it("rejects an outgroup absent from both sides", () => {
    expect(
      tool.execute({
        outgroupTipIds: ["X"],
        firstSideTipIds: ["A"],
        secondSideTipIds: ["B"],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "outgroupTipIds", code: "invalid_domain" }] },
    });
  });
});
