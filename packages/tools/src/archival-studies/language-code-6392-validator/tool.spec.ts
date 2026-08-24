import { describe, expect, it } from "vitest";
import {
  calculateLanguageCode6392Validator,
  languageCode6392ValidatorExample,
  runLanguageCode6392Validator,
} from "./tool.js";

describe("archival-studies/language-code-6392-validator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLanguageCode6392Validator(languageCode6392ValidatorExample.input),
    ).toEqual({ ok: true, output: languageCode6392ValidatorExample.output });
  });

  it("rejects wrong lengths, digits and non-ASCII letters", () => {
    expect(calculateLanguageCode6392Validator({ code: "en" }).isValid).toBe(
      false,
    );
    expect(calculateLanguageCode6392Validator({ code: "e1g" }).isValid).toBe(
      false,
    );
    expect(calculateLanguageCode6392Validator({ code: "eng " }).isValid).toBe(
      true,
    );
    expect(calculateLanguageCode6392Validator({ code: "zzz" }).isValid).toBe(
      false,
    );
    expect(calculateLanguageCode6392Validator({ code: "qaa" }).isValid).toBe(
      true,
    );
  });

  it("rejects empty codes", () => {
    expect(runLanguageCode6392Validator({ code: "" }).ok).toBe(false);
  });
});
