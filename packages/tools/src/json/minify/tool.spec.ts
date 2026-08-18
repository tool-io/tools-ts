import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateJsonMinify,
  jsonMinifyExample,
  jsonMinifyTool,
} from "./tool.js";

describe("JSON Minifier", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = jsonMinifyTool.execute(jsonMinifyExample.input);
    expect(result).toEqual({ ok: true, output: jsonMinifyExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(jsonMinifyTool.id).toBe("json/minify");
    expect(validateToolContract(jsonMinifyTool)).toEqual([]);
  });

  it("preserves strings with internal whitespace", () => {
    const result = calculateJsonMinify({ json: '{ "s": "a  b" }' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.minified).toBe('{"s":"a  b"}');
  });

  it("rejects invalid JSON and malformed probes", () => {
    expect(calculateJsonMinify(null).ok).toBe(false);
    expect(calculateJsonMinify({ json: "{oops}" })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateJsonMinify({ extra: true, json: "1" })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateJsonMinify({ json: "" })).toMatchObject({
      error: { code: "invalid_input" },
    });
  });
});
