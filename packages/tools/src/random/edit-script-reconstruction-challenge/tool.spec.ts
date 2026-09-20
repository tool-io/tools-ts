import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateEditScriptReconstructionChallenge,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Edit reconstruction", () => {
  lightweightModelTests(
    tool,
    calculateEditScriptReconstructionChallenge,
    example,
  );
  it("lightweight independently removes one supplementary code point and labels empty deletions", () => {
    expect(
      tool.execute(
        {
          source: "😀a",
          alphabet: ["💡"],
          operations: ["delete"],
          editCount: 1,
        },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        target: "a",
        edits: [
          { kind: "delete", index: 0, before: "😀", after: "", applied: true },
        ],
        minimumDistance: 1,
      },
    });
    expect(
      tool.execute({
        source: "",
        alphabet: ["x"],
        operations: ["delete"],
        editCount: 1,
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        target: "",
        edits: [{ index: 0, applied: false }],
        minimumDistance: 0,
      },
    });
  });
  it("lightweight rejects multicharacter alphabet entries and oversized code-point sources", () => {
    expect(tool.execute({ ...example.input, alphabet: ["ab"] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "alphabet", code: "invalid_character" }] },
    });
    expect(
      tool.execute({ ...example.input, source: "a".repeat(33) }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "source", code: "resource_limit" }] },
    });
  });
});
