import { describe, it, expect } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, {
  example,
  calculateEmptyStateCopyPacket,
  runEmptyStateCopyPacket,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight replacement metacharacters stay literal caller content", () => {
    for (const context of ["$&", "$\u0060", "$'"]) {
      const result = tool.execute({
        ...example.input,
        templates: [{ kind: "empty", text: "No {context}!" }],
        contexts: [context],
        actions: ["Wait"],
        count: 1,
        previewLimit: 256,
      });
      if (!result.ok) throw new Error("Expected literal context replacement");
      expect(result.output.packets[0]?.text).toBe("No " + context + "!");
      expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(
        true,
      );
    }
  });
  it("lightweight supplementary Unicode previews retain a truthful UTF-16 bound", () => {
    const result = tool.execute({
      ...example.input,
      templates: [{ kind: "loading", text: "{context}".repeat(3) }],
      contexts: ["😀".repeat(64)],
      actions: ["Wait"],
      count: 1,
      previewLimit: 256,
    });
    if (!result.ok) throw new Error("Expected bounded Unicode packet");
    expect(result.output.packets[0]?.preview.length).toBe(384);
    expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(true);
  });
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateEmptyStateCopyPacket, example);
    expect(runEmptyStateCopyPacket(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute(
        {
          ...example.input,
          templates: [{ kind: "loading", text: "{context}/{context}" }],
          contexts: ["x"],
          actions: ["Wait"],
          count: 1,
        },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        packets: [
          { kind: "loading", text: "x/x", preview: "x/x", action: "Wait" },
        ],
      },
    });
  });
});
