import { describe, expect, it } from "vitest";
import { invalidInput, toolSuccess } from "../core/result.js";
import { chokerSizeTool } from "../size/choker/tool.js";
import { collarSizeTool } from "../size/collar/tool.js";
import { executeChain, validateChain } from "./tool.js";
import type {
  ChainDocument,
  ChainToolDefinition,
  ChainToolResolver,
} from "./types.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const sourceTool = {
  contractVersion: 1,
  description: "Return a supplied finite number.",
  execute: (input: unknown) =>
    isRecord(input) &&
    typeof input.value === "number" &&
    Number.isFinite(input.value)
      ? toolSuccess({ value: input.value })
      : invalidInput([
          {
            code: "finite_number_required",
            field: "value",
            message: "Value must be a finite number.",
          },
        ]),
  execution: { kind: "pure" },
  id: "fixture/number",
  inputSchema: { type: "object" },
  outputSchema: { type: "object" },
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "value", label: "Value", valueType: { type: "number" } },
    ],
  },
  title: "Number",
} satisfies ChainToolDefinition;

const addTool = {
  contractVersion: 1,
  description: "Add two finite numbers.",
  execute: async (input: unknown) =>
    isRecord(input) &&
    typeof input.left === "number" &&
    typeof input.right === "number" &&
    Number.isFinite(input.left) &&
    Number.isFinite(input.right)
      ? toolSuccess({ sum: input.left + input.right })
      : invalidInput([
          {
            code: "two_numbers_required",
            field: "",
            message: "Two finite numbers are required.",
          },
        ]),
  execution: { kind: "pure" },
  id: "fixture/add",
  inputSchema: { type: "object" },
  outputSchema: { type: "object" },
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "sum", label: "Sum", valueType: { type: "number" } },
    ],
  },
  title: "Add",
} satisfies ChainToolDefinition;

const tools = new Map<string, ChainToolDefinition>([
  [sourceTool.id, sourceTool],
  [addTool.id, addTool],
]);
const resolveTool: ChainToolResolver = async (id) => tools.get(id);
const node = (
  id: string,
  toolId: string,
  inputs: Readonly<Record<string, number>> = {},
) => ({ id, inputs, toolId, toolVersion: 1 });

describe("tool chain", () => {
  it("executes fan-in and inline downstream inputs deterministically", async () => {
    const document: ChainDocument = {
      edges: [
        {
          from: { nodeId: "first", portId: "value" },
          to: { nodeId: "sum", portId: "left" },
        },
        {
          from: { nodeId: "second", portId: "value" },
          to: { nodeId: "sum", portId: "right" },
        },
      ],
      nodes: [
        node("first", sourceTool.id, { value: 20 }),
        node("second", sourceTool.id, { value: 22 }),
        node("sum", addTool.id),
      ],
      version: 1,
    };

    const result = await executeChain(document, { resolveTool });
    expect(result.ok).toBe(true);
    expect(result.nodes.map(({ id }) => id)).toEqual([
      "first",
      "second",
      "sum",
    ]);
    expect(result.nodes.at(-1)?.outputs).toEqual({ sum: 42 });
    expect(JSON.stringify(result)).not.toContain("undefined");
  });

  it("supports fan-out from one output", async () => {
    const document: ChainDocument = {
      edges: ["left", "right"].map((portId) => ({
        from: { nodeId: "source", portId: "value" },
        to: { nodeId: "sum", portId },
      })),
      nodes: [
        node("source", sourceTool.id, { value: 4 }),
        node("sum", addTool.id),
      ],
      version: 1,
    };
    const result = await executeChain(document, { resolveTool });
    expect(result.nodes.at(-1)?.outputs).toEqual({ sum: 8 });
  });

  it("chains real tools through nested canonical measurement paths", async () => {
    const sizeTools = new Map<string, ChainToolDefinition>([
      [collarSizeTool.id, collarSizeTool as ChainToolDefinition],
      [chokerSizeTool.id, chokerSizeTool as ChainToolDefinition],
    ]);
    const result = await executeChain(
      {
        edges: [
          {
            from: { nodeId: "collar", portId: "neck" },
            to: { nodeId: "choker", portId: "neck" },
          },
        ],
        nodes: [
          {
            id: "collar",
            inputs: { neck: 39, unit: "cm" },
            toolId: collarSizeTool.id,
            toolVersion: 1,
          },
          {
            id: "choker",
            inputs: { ease: 2, unit: "cm" },
            toolId: chokerSizeTool.id,
            toolVersion: 1,
          },
        ],
        version: 1,
      },
      { resolveTool: (id) => sizeTools.get(id) },
    );
    expect(result.ok).toBe(true);
    expect(result.nodes.at(-1)?.outputs.neck).toBe(39);
  });

  it("rejects missing required inputs before execution", async () => {
    const result = await validateChain(
      { edges: [], nodes: [node("sum", addTool.id)], version: 1 },
      { resolveTool },
    );
    expect(result).toMatchObject({
      issues: [
        { code: "required_input_missing", portId: "left" },
        { code: "required_input_missing", portId: "right" },
      ],
      ok: false,
    });
  });

  it("allows an explicit connection between different semantic types", async () => {
    const textTool = {
      ...sourceTool,
      id: "fixture/text",
      ports: {
        ...sourceTool.ports,
        outputs: [
          { id: "value", label: "Value", valueType: { type: "string" } },
        ],
      },
    } satisfies ChainToolDefinition;
    const result = await validateChain(
      {
        edges: [
          {
            from: { nodeId: "text", portId: "value" },
            to: { nodeId: "sum", portId: "left" },
          },
        ],
        nodes: [
          node("text", textTool.id, { value: 2 }),
          node("sum", addTool.id, { right: 3 }),
        ],
        version: 1,
      },
      {
        resolveTool: (id) => (id === textTool.id ? textTool : resolveTool(id)),
      },
    );
    expect(result).toEqual({ issues: [], ok: true });
  });

  it("detects cycles", async () => {
    const passTool = {
      ...sourceTool,
      id: "fixture/pass",
    } satisfies ChainToolDefinition;
    const result = await validateChain(
      {
        edges: [
          {
            from: { nodeId: "a", portId: "value" },
            to: { nodeId: "b", portId: "value" },
          },
          {
            from: { nodeId: "b", portId: "value" },
            to: { nodeId: "a", portId: "value" },
          },
        ],
        nodes: [node("a", passTool.id), node("b", passTool.id)],
        version: 1,
      },
      { resolveTool: () => passTool },
    );
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: "cycle_detected" }),
        ]),
      );
  });

  it("returns a node-level error without running downstream nodes", async () => {
    const result = await executeChain(
      {
        edges: [
          {
            from: { nodeId: "bad", portId: "value" },
            to: { nodeId: "sum", portId: "left" },
          },
        ],
        nodes: [
          node("bad", sourceTool.id, { value: Number.NaN }),
          node("sum", addTool.id, { right: 2 }),
        ],
        version: 1,
      },
      { resolveTool },
    );
    expect(result).toMatchObject({
      error: { code: "chain_invalid" },
      nodes: [],
      ok: false,
    });
  });

  it("serializes a tool input failure at its node", async () => {
    const result = await executeChain(
      {
        edges: [],
        nodes: [
          {
            id: "source",
            inputs: { value: "not a number" },
            toolId: sourceTool.id,
            toolVersion: 1,
          },
        ],
        version: 1,
      },
      { resolveTool },
    );
    expect(result).toMatchObject({
      error: {
        code: "node_failed",
        nodeId: "source",
        toolError: { code: "invalid_input" },
      },
      ok: false,
    });
  });

  it("converts thrown values into serializable node errors", async () => {
    const throwingTool = {
      ...sourceTool,
      execute: () => {
        throw new Error("fixture failure");
      },
      id: "fixture/throw",
    } satisfies ChainToolDefinition;
    const result = await executeChain(
      {
        edges: [],
        nodes: [node("throw", throwingTool.id, { value: 1 })],
        version: 1,
      },
      { resolveTool: () => throwingTool },
    );
    expect(result).toMatchObject({
      error: {
        code: "node_threw",
        nodeId: "throw",
        toolError: "Error: fixture failure",
      },
      ok: false,
    });
    expect(JSON.stringify(result)).not.toContain("undefined");
  });

  it("honors cancellation before executing a node", async () => {
    const result = await executeChain(
      {
        edges: [],
        nodes: [node("source", sourceTool.id, { value: 1 })],
        version: 1,
      },
      { resolveTool, signal: { aborted: true } },
    );
    expect(result).toMatchObject({
      error: { code: "chain_aborted", nodeId: "source" },
      ok: false,
    });
  });
});
