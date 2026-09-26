import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pathSegments: readonly number[];
  readonly chord: number;
};
export type Output = {
  readonly pathLength: number;
  readonly tortuosity: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pathSegments: { type: "array", maxItems: 256, items: { type: "number" } },
    chord: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pathSegments", "chord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pathLength: { type: "number" },
    tortuosity: { type: "number" },
    excess: { type: "number" },
  },
  required: ["pathLength", "tortuosity", "excess"],
} as const;
/** Calculate root model path chord ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pathSegments, chord } = request;
  const compute = (): Output => {
    H.positive(chord);
    H.domain(
      pathSegments.every((x) => x >= 0) &&
        pathSegments.reduce((a, b) => a + b, 0) >= chord,
    );
    return {
      pathLength: pathSegments.reduce((a, b) => a + b, 0),
      tortuosity: pathSegments.reduce((a, b) => a + b, 0) / chord,
      excess: pathSegments.reduce((a, b) => a + b, 0) - chord,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pathSegments: [3, 4, 5], chord: 10 },
  output: { pathLength: 12, tortuosity: 1.2, excess: 2 },
} satisfies ToolExample<Input, Output>;
export const rootModelPathChordRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/root-model-path-chord-ratio",
    title: "Root Model Path Chord Ratio Tool",
    description:
      "Calculate root model path chord ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pathSegments: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        chord: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pathSegments", "chord"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pathLength: { type: "number" },
        tortuosity: { type: "number" },
        excess: { type: "number" },
      },
      required: ["pathLength", "tortuosity", "excess"],
    },
    ports: {
      inputs: [
        {
          id: "pathSegments",
          label: "Path Segments",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "chord",
          label: "Chord",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pathLength",
          label: "Path Length",
          valueType: { type: "number" },
        },
        {
          id: "tortuosity",
          label: "Tortuosity",
          valueType: { type: "number" },
        },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rootModelPathChordRatioTool.execute;
export default rootModelPathChordRatioTool;
