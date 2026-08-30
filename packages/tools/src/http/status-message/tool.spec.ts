import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runStatusMessage, statusMessageTool, statusMessageInputSchema, statusMessageOutputSchema } from "./index.js";
describe("HTTP Status Message", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(statusMessageTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, statusMessageInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, statusMessageOutputSchema)).toBe(true);
    expect(runStatusMessage(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runStatusMessage({"status":499})).toEqual({ok: true, output: {"message":"","known":false}}));
  it("matches independent case 2", () => expect(runStatusMessage({"status":418})).toEqual({ok: true, output: {"message":"(Unused)","known":true}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runStatusMessage({"status":99});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "status", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runStatusMessage(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
