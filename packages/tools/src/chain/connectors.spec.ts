import { describe, expect, it } from "vitest";
import { bodyMassIndexTool } from "../body-mass-index/tool.js";
import { lengthConversionTool } from "../convert/length/tool.js";
import { abayaReconstructionSizeTool } from "../size/abaya-reconstruction/tool.js";
import { chokerSizeTool } from "../size/choker/tool.js";
import { collarSizeTool } from "../size/collar/tool.js";
import { recommendConnection } from "./connectors.js";
import { executeChain, isChainToolDefinition } from "./tool.js";

const requireChainTool = (value: unknown) => {
  if (!isChainToolDefinition(value))
    throw new Error("Fixture is not chainable.");
  return value;
};

const abaya = requireChainTool(abayaReconstructionSizeTool);
const bmi = requireChainTool(bodyMassIndexTool);
const convertLength = requireChainTool(lengthConversionTool);
const choker = requireChainTool(chokerSizeTool);
const collar = requireChainTool(collarSizeTool);

const requirePort = (
  tool: typeof collar,
  direction: "inputs" | "outputs",
  id: string,
) => {
  const port = tool.ports[direction].find((candidate) => candidate.id === id);
  if (!port) throw new Error(`Missing ${direction} port ${id}.`);
  return port;
};

describe("chain connector discovery", () => {
  it("recognizes a safe direct connection without suggesting a connector", () => {
    expect(
      recommendConnection(
        requirePort(collar, "outputs", "neck"),
        requirePort(choker, "inputs", "neck"),
        [convertLength],
      ),
    ).toEqual({ connectors: [], direct: true });
  });

  it("recommends an ordinary one-step tool for a semantic mismatch", () => {
    expect(
      recommendConnection(
        requirePort(abaya, "outputs", "height"),
        requirePort(bmi, "inputs", "heightM"),
        [convertLength],
      ),
    ).toEqual({
      connectors: [
        {
          inputPortId: "value",
          outputPortId: "value",
          requiredInputPortIds: ["fromUnit", "toUnit"],
          title: "Convert Length",
          toolId: "convert/length",
          toolVersion: 1,
        },
      ],
      direct: true,
    });
  });

  it("treats connector use as context rather than tool membership", () => {
    const ordinaryConverter = requireChainTool({
      ...convertLength,
      id: "fixture/ordinary-length-converter",
      ports: {
        inputs: convertLength.ports.inputs,
        outputs: convertLength.ports.outputs,
      },
    });

    expect(
      recommendConnection(
        requirePort(abaya, "outputs", "height"),
        requirePort(bmi, "inputs", "heightM"),
        [ordinaryConverter],
      ),
    ).toEqual({
      connectors: [
        {
          inputPortId: "value",
          outputPortId: "value",
          requiredInputPortIds: ["fromUnit", "toUnit"],
          title: "Convert Length",
          toolId: "fixture/ordinary-length-converter",
          toolVersion: 1,
        },
      ],
      direct: true,
    });
  });

  it("executes a user-confirmed connector as a visible node", async () => {
    const tools = new Map(
      [abaya, convertLength, bmi].map((tool) => [tool.id, tool]),
    );
    const result = await executeChain(
      {
        edges: [
          {
            from: { nodeId: "abaya", portId: "height" },
            to: { nodeId: "convert-length", portId: "value" },
          },
          {
            from: { nodeId: "convert-length", portId: "value" },
            to: { nodeId: "bmi", portId: "heightM" },
          },
        ],
        nodes: [
          {
            id: "abaya",
            inputs: { chest: 96, height: 175, unit: "cm", waist: 82 },
            toolId: abaya.id,
            toolVersion: 1,
          },
          {
            id: "convert-length",
            inputs: { fromUnit: "cm", toUnit: "m" },
            toolId: convertLength.id,
            toolVersion: 1,
          },
          {
            id: "bmi",
            inputs: { weightKg: 70 },
            toolId: bmi.id,
            toolVersion: 1,
          },
        ],
        version: 1,
      },
      { resolveTool: (toolId) => tools.get(toolId) },
    );

    expect(result.ok).toBe(true);
    expect(result.nodes.map(({ id }) => id)).toEqual([
      "abaya",
      "convert-length",
      "bmi",
    ]);
    expect(result.nodes.at(-1)?.outputs.bmi).toBeCloseTo(70 / 1.75 ** 2);
  });
});
