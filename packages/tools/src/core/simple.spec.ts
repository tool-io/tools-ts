import { describe, expect, it } from "vitest";
import { createSimpleTool } from "./simple.js";

describe("createSimpleTool", () => {
  it("rejects input fields excluded by its published schema", () => {
    const tool = createSimpleTool({
      calculate: (input) => ({ doubled: (input.value as number) * 2 }),
      description: "Double a value.",
      id: "test/double",
      inputs: [{ id: "value", kind: "number", label: "Value" }],
      outputs: [{ id: "doubled", kind: "number", label: "Doubled" }],
      title: "Double",
    });

    expect(tool.execute({ extra: true, value: 2 })).toEqual({
      error: {
        issues: [
          {
            code: "unknown_field",
            field: "extra",
            message: "extra is not a supported input field.",
          },
        ],
        code: "invalid_input",
      },
      ok: false,
    });
  });

  it("rejects calculated fields excluded by its published output schema", () => {
    const tool = createSimpleTool({
      calculate: (input) => ({
        doubled: (input.value as number) * 2,
        extra: true,
      }),
      description: "Double a value.",
      id: "test/double",
      inputs: [{ id: "value", kind: "number", label: "Value" }],
      outputs: [{ id: "doubled", kind: "number", label: "Doubled" }],
      title: "Double",
    });

    expect(tool.execute({ value: 2 })).toMatchObject({
      error: { issues: [{ code: "invalid_output", field: "extra" }] },
      ok: false,
    });
  });
});
