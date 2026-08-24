import { describe, expect, it } from "vitest";
import {
  ecldConfigSelectorExample as example,
  runEcldConfigSelector,
} from "./tool.js";
describe("ECDL configuration lookup", () => {
  it("returns the selected configuration", () =>
    expect(runEcldConfigSelector(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects unknown configurations", () =>
    expect(runEcldConfigSelector({ config: "other" }).ok).toBe(false));
});
