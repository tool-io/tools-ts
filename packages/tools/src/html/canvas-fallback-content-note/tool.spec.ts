import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, canvasFallbackContentNoteInputSchema, canvasFallbackContentNoteOutputSchema } from "./index.js";
describe("html/canvas-fallback-content-note", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, canvasFallbackContentNoteInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, canvasFallbackContentNoteOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "canvasSupported": true,
  "scriptingEnabled": true
})).toEqual({ ok: true, output: {
  "visualFallback": false,
  "scriptsCanDraw": true
} });
    expect(tool.execute({
  "canvasSupported": false,
  "scriptingEnabled": false
})).toEqual({ ok: true, output: {
  "visualFallback": true,
  "scriptsCanDraw": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "canvasSupported", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("uses fallback when scripting is disabled in interactive visual media", () => {
    expect(tool.execute({ canvasSupported: true, scriptingEnabled: false })).toEqual({ ok: true, output: { visualFallback: true, scriptsCanDraw: false } });
  });
});
