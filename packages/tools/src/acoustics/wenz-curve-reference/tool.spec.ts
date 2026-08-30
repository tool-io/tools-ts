import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { example, lookupReference } from "./tool.js";

describe(tool.id, () => {
  it("executes its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("publishes a valid contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });

  it("returns the selected sourced statement", () => {
    expect(lookupReference(example.input)).toEqual(example.output);
  });

  it("rejects missing and unsupported topics", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ topic: "unsupported" })).toMatchObject({ ok: false });
  });
});
