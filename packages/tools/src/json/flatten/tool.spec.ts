import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateJsonFlatten,
  jsonFlattenExample,
  jsonFlattenTool,
} from "./tool.js";

describe("JSON Flatten", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = jsonFlattenTool.execute(jsonFlattenExample.input);
    expect(result).toEqual({ ok: true, output: jsonFlattenExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(jsonFlattenTool.id).toBe("json/flatten");
    expect(validateToolContract(jsonFlattenTool)).toEqual([]);
  });

  it("keeps empty containers as empty-string markers", () => {
    const result = calculateJsonFlatten({
      document: { list: [], nested: {} },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.flat).toEqual({ list: "", nested: "" });
  });

  it("rejects non-object documents", () => {
    expect(calculateJsonFlatten(null)).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculateJsonFlatten({ document: [1, 2] }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(calculateJsonFlatten({ extra: true })).toMatchObject({
      error: { code: "invalid_input" },
    });
  });
});
