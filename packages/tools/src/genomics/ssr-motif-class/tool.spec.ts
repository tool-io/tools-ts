import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./index.js";
const expectIssue = (input: unknown, field: string, code: string): void => {
  const result = tool.execute(input);
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected a structured input error.");
  expect(result.error.code).toBe("invalid_input");
  expect(result.error.issues).toEqual(
    expect.arrayContaining([expect.objectContaining({ field, code })]),
  );
};
describe(tool.id, () => {
  it("executes the canonical example exactly", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract and portable example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expectIssue({}, "motif", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("requires complete repetitions when reducing the motif", () => {
    expect(calculate({ motif: "AACAAC" })).toEqual({ primitiveMotif: "AAC", primitiveLength: 3, motifClass: "tri" });
    expect(calculate({ motif: "ATATA" })).toEqual({ primitiveMotif: "ATATA", primitiveLength: 5, motifClass: "penta" });
    expect(calculate({ motif: " aaaa " })).toEqual({ primitiveMotif: "A", primitiveLength: 1, motifClass: "mono" });
  });
  it("handles a long almost-periodic motif without repeatedly expanding strings", () => {
    const motif = "A".repeat(1024) + "C";
    expect(calculate({ motif })).toEqual({ primitiveMotif: motif, primitiveLength: 1025, motifClass: "longer" });
  });
  it("reports malformed and empty motifs against their field", () => {
    expectIssue({ motif: "N" }, "motif", "invalid_field");
    expectIssue({ motif: "" }, "motif", "invalid_field");
  });
});
