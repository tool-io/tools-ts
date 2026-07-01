import { describe, expect, it } from "vitest";
import { calculateTextShingles } from "./tool.js";
describe("text shingling", () => { it("creates word bigrams", () => expect(calculateTextShingles({ text: "Tool io works offline" })).toEqual({ ok: true, output: { shingles: ["Tool io", "io works", "works offline"], total: 3, unique: 3 } })); it("supports normalization", () => expect(calculateTextShingles({ text: "A a A", size: 1, lowercase: true })).toMatchObject({ ok: true, output: { unique: 1 } })); });
