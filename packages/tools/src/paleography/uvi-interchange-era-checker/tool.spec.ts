import { describe, expect, it } from "vitest";
import {
  runUviInterchangeEraChecker,
  uviInterchangeEraCheckerExample,
} from "./tool.js";

describe("uvi-interchange-era-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runUviInterchangeEraChecker(uviInterchangeEraCheckerExample.input),
    ).toEqual({ ok: true, output: uviInterchangeEraCheckerExample.output });
  });

  it("prefers post-standardization when -ve dominates", () => {
    const result = runUviInterchangeEraChecker({ text: "love and give" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.orthographyHint as string).toBe(
      "post_standardization_spelling_likely",
    );
    expect(result.output.veFinalTokenCount as number).toBe(2);
  });

  it("rejects empty text", () => {
    expect(runUviInterchangeEraChecker({ text: "" }).ok).toBe(false);
  });

  it("ignores surrounding punctuation when checking word endings", () => {
    const result = runUviInterchangeEraChecker({ text: '"Haue," and love.' });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ueFinalTokenCount).toBe(1);
    expect(result.output.veFinalTokenCount).toBe(1);
    expect(result.output.orthographyHint).toBe("indeterminate");
  });
});
