import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateJsonPrettyPrint,
  jsonPrettyPrintExample,
  jsonPrettyPrintTool,
} from "./tool.js";

describe("JSON Pretty Printer", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = jsonPrettyPrintTool.execute(jsonPrettyPrintExample.input);
    expect(result).toEqual({ ok: true, output: jsonPrettyPrintExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(jsonPrettyPrintTool.id).toBe("json/pretty-print");
    expect(validateToolContract(jsonPrettyPrintTool)).toEqual([]);
  });

  it("honors custom indent widths", () => {
    const result = calculateJsonPrettyPrint({
      indent: 4,
      json: '{"a":[1]}',
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.pretty).toBe('{\n    "a": [\n        1\n    ]\n}\n');
  });

  it("rejects invalid JSON and bad indents", () => {
    expect(calculateJsonPrettyPrint({ json: "{bad}" })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculateJsonPrettyPrint({ indent: 0, json: "1" }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(calculateJsonPrettyPrint(null)).toMatchObject({
      error: { code: "invalid_input" },
    });
  });
});
