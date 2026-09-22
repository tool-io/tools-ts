import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unloadedBefore: number;
  readonly unloadedAfter: number;
  readonly loadedReading: number;
  readonly useMidpointZero: boolean;
};
export type Output = {
  readonly zeroReference: number;
  readonly correctedReading: number;
  readonly zeroDrift: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unloadedBefore: { type: "number" },
    unloadedAfter: { type: "number" },
    loadedReading: { type: "number" },
    useMidpointZero: { type: "boolean" },
  },
  required: [
    "unloadedBefore",
    "unloadedAfter",
    "loadedReading",
    "useMidpointZero",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroReference: { type: "number" },
    correctedReading: { type: "number" },
    zeroDrift: { type: "number" },
  },
  required: ["zeroReference", "correctedReading", "zeroDrift"],
} as const;
/** Calculate load fixture zero shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unloadedBefore, unloadedAfter, loadedReading, useMidpointZero } =
    request;
  const compute = (): Output => {
    return (() => {
      const zeroReference = useMidpointZero
        ? unloadedBefore / 2 + unloadedAfter / 2
        : unloadedBefore;
      return {
        zeroReference,
        correctedReading: loadedReading - zeroReference,
        zeroDrift: unloadedAfter - unloadedBefore,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    unloadedBefore: 2,
    unloadedAfter: 4,
    loadedReading: 10,
    useMidpointZero: true,
  },
  output: { zeroReference: 3, correctedReading: 7, zeroDrift: 2 },
} satisfies ToolExample<Input, Output>;
export const loadFixtureZeroShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/load-fixture-zero-shift",
    title: "Load Fixture Zero Shift Tool",
    description:
      "Calculate load fixture zero shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unloadedBefore: { type: "number" },
        unloadedAfter: { type: "number" },
        loadedReading: { type: "number" },
        useMidpointZero: { type: "boolean" },
      },
      required: [
        "unloadedBefore",
        "unloadedAfter",
        "loadedReading",
        "useMidpointZero",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroReference: { type: "number" },
        correctedReading: { type: "number" },
        zeroDrift: { type: "number" },
      },
      required: ["zeroReference", "correctedReading", "zeroDrift"],
    },
    ports: {
      inputs: [
        {
          id: "unloadedBefore",
          label: "Unloaded Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unloadedAfter",
          label: "Unloaded After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loadedReading",
          label: "Loaded Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useMidpointZero",
          label: "Use Midpoint Zero",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "zeroReference",
          label: "Zero Reference",
          valueType: { type: "number" },
        },
        {
          id: "correctedReading",
          label: "Corrected Reading",
          valueType: { type: "number" },
        },
        { id: "zeroDrift", label: "Zero Drift", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = loadFixtureZeroShiftTool.execute;
export default loadFixtureZeroShiftTool;
