import { describe, expect, it } from "vitest";
import {
  deJouvenelExample,
  lookupDeJouvenelFuturibles,
  runDeJouvenel,
} from "./tool.js";

describe("De Jouvenel futuribles anticipation school lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runDeJouvenel(deJouvenelExample.input)).toEqual({
      ok: true,
      output: deJouvenelExample.output,
    });
  });

  it("looks up anticipation", () => {
    expect(
      lookupDeJouvenelFuturibles({ focus: "anticipation" }).schoolEntry,
    ).toContain("political and social process");
  });

  it("looks up a limitation", () => {
    expect(
      lookupDeJouvenelFuturibles({ focus: "limitation" }).schoolEntry,
    ).toContain("embed assumptions");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runDeJouvenel({ focus: "prediction" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "focus" }] },
      ok: false,
    });
  });
});
