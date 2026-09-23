import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialOddParity: boolean;
  readonly togglePositions: readonly number[];
  readonly width: number;
};
export type Output = {
  readonly parityChanges: boolean;
  readonly finalOddParity: boolean;
  readonly netToggleBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialOddParity: { type: "boolean" },
    togglePositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    width: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["initialOddParity", "togglePositions", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parityChanges: { type: "boolean" },
    finalOddParity: { type: "boolean" },
    netToggleBits: { type: "integer" },
  },
  required: ["parityChanges", "finalOddParity", "netToggleBits"],
} as const;
/** Resolve parity after a supplied sequence of bit toggles, counting repeated toggles modulo two. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialOddParity, togglePositions, width } = request;
  const compute = (): Output => {
    H.integer(width, 1, 256);
    H.domain(togglePositions.every((x) => x >= 0 && x < width));
    const active = new Set<number>();
    for (const x of togglePositions)
      active.has(x) ? active.delete(x) : active.add(x);
    const parityChanges = active.size % 2 === 1;
    return {
      parityChanges,
      finalOddParity: initialOddParity !== parityChanges,
      netToggleBits: active.size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialOddParity: false, togglePositions: [1, 1, 2], width: 4 },
  output: { parityChanges: true, finalOddParity: true, netToggleBits: 1 },
} satisfies ToolExample<Input, Output>;
export const parityChangeFromToggleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/parity-change-from-toggle",
    title: "Parity Change From Toggle Tool",
    description:
      "Resolve parity after a supplied sequence of bit toggles, counting repeated toggles modulo two.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialOddParity: { type: "boolean" },
        togglePositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        width: { type: "integer", minimum: 1, maximum: 256 },
      },
      required: ["initialOddParity", "togglePositions", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parityChanges: { type: "boolean" },
        finalOddParity: { type: "boolean" },
        netToggleBits: { type: "integer" },
      },
      required: ["parityChanges", "finalOddParity", "netToggleBits"],
    },
    ports: {
      inputs: [
        {
          id: "initialOddParity",
          label: "Initial Odd Parity",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "togglePositions",
          label: "Toggle Positions",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "parityChanges",
          label: "Parity Changes",
          valueType: { type: "boolean" },
        },
        {
          id: "finalOddParity",
          label: "Final Odd Parity",
          valueType: { type: "boolean" },
        },
        {
          id: "netToggleBits",
          label: "Net Toggle Bits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = parityChangeFromToggleTool.execute;
export default parityChangeFromToggleTool;
