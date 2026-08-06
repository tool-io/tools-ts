import { describe, expect, it } from "vitest";
import {
  runScaledDotProductAttention,
  scaledDotProductAttentionExample,
} from "./tool.js";
describe("scaled dot-product attention", () => {
  it("publishes an executable example", () =>
    expect(
      runScaledDotProductAttention(scaledDotProductAttentionExample.input),
    ).toEqual({ ok: true, output: scaledDotProductAttentionExample.output }));
});
