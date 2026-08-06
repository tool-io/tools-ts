import { describe, expect, it } from "vitest";
import {
  nonnegativeMatrixFactorizationExample,
  runNonnegativeMatrixFactorization,
} from "./tool.js";
describe("NMF", () => {
  it("publishes an executable example", () =>
    expect(
      runNonnegativeMatrixFactorization(
        nonnegativeMatrixFactorizationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: nonnegativeMatrixFactorizationExample.output,
    }));
});
