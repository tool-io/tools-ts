import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly observedToBase: number;
  readonly background: number;
  readonly backgroundToBase: number;
};
export type Output = {
  readonly observedBase: number;
  readonly backgroundBase: number;
  readonly netBase: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    observedToBase: { type: "number", exclusiveMinimum: 0 },
    background: { type: "number" },
    backgroundToBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observed", "observedToBase", "background", "backgroundToBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedBase: { type: "number" },
    backgroundBase: { type: "number" },
    netBase: { type: "number" },
  },
  required: ["observedBase", "backgroundBase", "netBase"],
} as const;
/** Calculate tracer background unit basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, observedToBase, background, backgroundToBase } = request;
  const compute = (): Output => {
    H.positive(observedToBase);
    H.positive(backgroundToBase);
    return {
      observedBase: observed * observedToBase,
      backgroundBase: background * backgroundToBase,
      netBase: observed * observedToBase - background * backgroundToBase,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observed: 10,
    observedToBase: 2,
    background: 3,
    backgroundToBase: 4,
  },
  output: { observedBase: 20, backgroundBase: 12, netBase: 8 },
} satisfies ToolExample<Input, Output>;
export const tracerBackgroundUnitBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/tracer-background-unit-basis",
    title: "Tracer Background Unit Basis Tool",
    description:
      "Calculate tracer background unit basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        observedToBase: { type: "number", exclusiveMinimum: 0 },
        background: { type: "number" },
        backgroundToBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "observed",
        "observedToBase",
        "background",
        "backgroundToBase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedBase: { type: "number" },
        backgroundBase: { type: "number" },
        netBase: { type: "number" },
      },
      required: ["observedBase", "backgroundBase", "netBase"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedToBase",
          label: "Observed To Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "background",
          label: "Background",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backgroundToBase",
          label: "Background To Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedBase",
          label: "Observed Base",
          valueType: { type: "number" },
        },
        {
          id: "backgroundBase",
          label: "Background Base",
          valueType: { type: "number" },
        },
        { id: "netBase", label: "Net Base", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tracerBackgroundUnitBasisTool.execute;
export default tracerBackgroundUnitBasisTool;
