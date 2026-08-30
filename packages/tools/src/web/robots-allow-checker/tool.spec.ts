import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runRobotsAllowChecker, robotsAllowCheckerTool, robotsAllowCheckerInputSchema, robotsAllowCheckerOutputSchema } from "./index.js";
describe("Robots Allow Checker", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(robotsAllowCheckerTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, robotsAllowCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, robotsAllowCheckerOutputSchema)).toBe(true);
    expect(runRobotsAllowChecker(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runRobotsAllowChecker({"robots":"User-agent: TestBot\nDisallow: /*.pdf$\nUser-agent: *\nDisallow: /\n","productToken":"testbot","path":"/a.pdf?download=1"})).toEqual({ok: true, output: {"allowed":true,"matchedRule":""}}));
  it("matches independent case 2", () => expect(runRobotsAllowChecker({"robots":"User-agent: *\nDisallow: /x\nAllow: /x\n","productToken":"Bot","path":"/x"})).toEqual({ok: true, output: {"allowed":true,"matchedRule":"Allow: /x"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runRobotsAllowChecker({"robots":"","productToken":"Bot","path":"relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "path", code: "invalid_path"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runRobotsAllowChecker(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
