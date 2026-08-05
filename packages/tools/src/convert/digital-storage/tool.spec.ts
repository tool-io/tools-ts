import { describe, expect, it } from "vitest";
import {
  convertDigitalStorage,
  digitalStorageExample,
  runDigitalStorage,
} from "./tool.js";

describe("Convert Digital Storage", () => {
  it("converts the canonical example", () =>
    expect(
      convertDigitalStorage(
        digitalStorageExample.input.value,
        digitalStorageExample.input.fromUnit,
        digitalStorageExample.input.toUnit,
      ),
    ).toBeCloseTo(digitalStorageExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertDigitalStorage(3, "b", "b")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertDigitalStorage(1, "unknown", "b")).toBeNull();
    expect(convertDigitalStorage(Number.NaN, "b", "b")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runDigitalStorage(digitalStorageExample.input)).toEqual({
      ok: true,
      output: digitalStorageExample.output,
    }));
});
