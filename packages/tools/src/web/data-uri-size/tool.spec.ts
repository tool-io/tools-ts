import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDataUriSize, example } from "./tool.js";

describe("web/data-uri-size", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateDataUriSize(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing input", () => {
    expect(tool.execute({}).ok).toBe(false);
  });
  it("handles representative case 1", () => {
    expect(tool.execute({ dataUri: "data:;base64,aGVsbG8=" })).toEqual({
      ok: true,
      output: { byteLength: 5 },
    });
  });
  it("rejects invalid case 2", () => {
    expect(tool.execute({ dataUri: "data:,bad%Z1" }).ok).toBe(false);
  });
  it("does not count a URL fragment as payload", () => {
    expect(tool.execute({ dataUri: "data:,abc#section" })).toEqual({
      ok: true,
      output: { byteLength: 3 },
    });
  });
});
