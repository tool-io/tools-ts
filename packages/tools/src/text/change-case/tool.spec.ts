import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateChangeCase,
  changeCaseExample,
  changeCaseTool,
} from "./tool.js";

describe("Change Case", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = changeCaseTool.execute(changeCaseExample.input);
    expect(result).toEqual({ ok: true, output: changeCaseExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(changeCaseTool.id).toBe("text/change-case");
    expect(validateToolContract(changeCaseTool)).toEqual([]);
  });

  it("splits acronyms and digit boundaries", () => {
    for (const [target, expected] of [
      ["snake", "parse_http_response_body_2"],
      ["kebab", "parse-http-response-body-2"],
      ["constant", "PARSE_HTTP_RESPONSE_BODY_2"],
      ["pascal", "ParseHttpResponseBody2"],
      ["camel", "parseHttpResponseBody2"],
    ] as const) {
      const result = calculateChangeCase({
        target,
        text: "parse HTTPResponse body_2",
      });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.output.formatted).toBe(expected);
    }
  });

  it("round-trips between conventions", () => {
    const snake = calculateChangeCase({
      target: "snake",
      text: "myVariableName",
    });
    expect(snake.ok).toBe(true);
    if (!snake.ok) return;
    const camel = calculateChangeCase({
      target: "camel",
      text: snake.output.formatted,
    });
    expect(camel.ok).toBe(true);
    if (camel.ok) expect(camel.output.formatted).toBe("myVariableName");
  });

  it("rejects malformed probes", () => {
    expect(calculateChangeCase(null).ok).toBe(false);
    expect(calculateChangeCase({ text: "x" })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculateChangeCase({ target: "camel", text: "---" }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateChangeCase({ extra: 1, target: "camel", text: "x" }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
