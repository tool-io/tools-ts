import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly curbLength: number;
  readonly fixedExclusions: number;
  readonly loadingLength: number;
  readonly bufferEachEnd: number;
};
export type Output = {
  readonly usableLength: number;
  readonly surplus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    curbLength: { type: "number", minimum: 0 },
    fixedExclusions: { type: "number", minimum: 0 },
    loadingLength: { type: "number", minimum: 0 },
    bufferEachEnd: { type: "number", minimum: 0 },
  },
  required: ["curbLength", "fixedExclusions", "loadingLength", "bufferEachEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usableLength: { type: "number" }, surplus: { type: "number" } },
  required: ["usableLength", "surplus"],
} as const;
/** Calculate curb space explicit loading buffer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { curbLength, fixedExclusions, loadingLength, bufferEachEnd } = request;
  const compute = (): Output => {
    H.domain(
      curbLength >= 0 &&
        fixedExclusions >= 0 &&
        fixedExclusions <= curbLength &&
        loadingLength >= 0 &&
        bufferEachEnd >= 0,
    );
    return {
      usableLength: curbLength - fixedExclusions,
      surplus: curbLength - fixedExclusions - loadingLength - 2 * bufferEachEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    curbLength: 30,
    fixedExclusions: 5,
    loadingLength: 15,
    bufferEachEnd: 2,
  },
  output: { usableLength: 25, surplus: 6 },
} satisfies ToolExample<Input, Output>;
export const curbSpaceExplicitLoadingBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/curb-space-explicit-loading-buffer",
    title: "Curb Space Explicit Loading Buffer Tool",
    description:
      "Calculate curb space explicit loading buffer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        curbLength: { type: "number", minimum: 0 },
        fixedExclusions: { type: "number", minimum: 0 },
        loadingLength: { type: "number", minimum: 0 },
        bufferEachEnd: { type: "number", minimum: 0 },
      },
      required: [
        "curbLength",
        "fixedExclusions",
        "loadingLength",
        "bufferEachEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableLength: { type: "number" },
        surplus: { type: "number" },
      },
      required: ["usableLength", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "curbLength",
          label: "Curb Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedExclusions",
          label: "Fixed Exclusions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loadingLength",
          label: "Loading Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bufferEachEnd",
          label: "Buffer Each End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableLength",
          label: "Usable Length",
          valueType: { type: "number" },
        },
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = curbSpaceExplicitLoadingBufferTool.execute;
export default curbSpaceExplicitLoadingBufferTool;
