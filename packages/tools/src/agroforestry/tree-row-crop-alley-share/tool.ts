import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowWidth: number;
  readonly alleyWidth: number;
  readonly excludedAlleyWidth: number;
};
export type Output = {
  readonly usableAlleyWidth: number;
  readonly alleyShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowWidth: { type: "number", minimum: 0 },
    alleyWidth: { type: "number", minimum: 0 },
    excludedAlleyWidth: { type: "number", minimum: 0 },
  },
  required: ["rowWidth", "alleyWidth", "excludedAlleyWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableAlleyWidth: { type: "number" },
    alleyShare: { type: "number" },
  },
  required: ["usableAlleyWidth", "alleyShare"],
} as const;
/** Calculate tree row crop alley share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowWidth, alleyWidth, excludedAlleyWidth } = request;
  const compute = (): Output => {
    H.domain(
      rowWidth >= 0 &&
        alleyWidth >= 0 &&
        rowWidth + alleyWidth > 0 &&
        excludedAlleyWidth >= 0 &&
        excludedAlleyWidth <= alleyWidth,
    );
    return {
      usableAlleyWidth: alleyWidth - excludedAlleyWidth,
      alleyShare: (alleyWidth - excludedAlleyWidth) / (rowWidth + alleyWidth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rowWidth: 2, alleyWidth: 8, excludedAlleyWidth: 2 },
  output: { usableAlleyWidth: 6, alleyShare: 0.6 },
} satisfies ToolExample<Input, Output>;
export const treeRowCropAlleyShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/tree-row-crop-alley-share",
    title: "Tree Row Crop Alley Share Tool",
    description:
      "Calculate tree row crop alley share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowWidth: { type: "number", minimum: 0 },
        alleyWidth: { type: "number", minimum: 0 },
        excludedAlleyWidth: { type: "number", minimum: 0 },
      },
      required: ["rowWidth", "alleyWidth", "excludedAlleyWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableAlleyWidth: { type: "number" },
        alleyShare: { type: "number" },
      },
      required: ["usableAlleyWidth", "alleyShare"],
    },
    ports: {
      inputs: [
        {
          id: "rowWidth",
          label: "Row Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alleyWidth",
          label: "Alley Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedAlleyWidth",
          label: "Excluded Alley Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableAlleyWidth",
          label: "Usable Alley Width",
          valueType: { type: "number" },
        },
        {
          id: "alleyShare",
          label: "Alley Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeRowCropAlleyShareTool.execute;
export default treeRowCropAlleyShareTool;
