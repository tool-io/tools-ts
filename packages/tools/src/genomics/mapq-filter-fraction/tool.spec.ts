import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
const expectIssue = (input: unknown, field: string, code = "invalid_value"): void => {
  expect(tool.execute(input)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ code, field }] } });
};
describe(tool.id, () => {
  it("does not count unavailable MAPQ 255 as high confidence", () => {
    expect(calculate({ mappingQualities: [255], minimumMapq: 0 })).toEqual({
      passingIndexes: [],
      unknownQualityCount: 1,
      passPercent: 0,
    });
  });
  it("computes the independent canonical example", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract and portable example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expectIssue({}, "mappingQualities", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("includes threshold qualities and constrains the SAM byte range", () => {
    expect(calculate({ mappingQualities: [0, 254, 255], minimumMapq: 254 })).toEqual({ passingIndexes: [1], unknownQualityCount: 1, passPercent: 100 / 3 });
    expectIssue({ ...example.input, minimumMapq: 255 }, "minimumMapq", "invalid_field");
    expectIssue({ ...example.input, mappingQualities: [256] }, "mappingQualities", "invalid_field");
    expectIssue({ ...example.input, mappingQualities: new Array<number>(1) }, "mappingQualities", "invalid_field");
  });
});
