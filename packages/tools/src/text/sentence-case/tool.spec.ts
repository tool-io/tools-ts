import { describe, expect, it } from "vitest";
import {
  sentenceCaseExample,
  calculateSentenceCase,
  runSentenceCase,
} from "./tool.js";

describe("text/sentence-case", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSentenceCase(sentenceCaseExample.input)).toEqual({
      ok: true,
      output: sentenceCaseExample.output,
    });
  });
});
