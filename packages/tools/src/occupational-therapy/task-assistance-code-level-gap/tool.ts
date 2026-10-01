import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCode: string;
  readonly secondCode: string;
  readonly suppliedCodes: readonly string[];
  readonly suppliedLevels: readonly number[];
};
export type Output = { readonly known: boolean; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCode: { type: "string", maxLength: 8192 },
    secondCode: { type: "string", maxLength: 8192 },
    suppliedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedLevels: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["firstCode", "secondCode", "suppliedCodes", "suppliedLevels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { known: { type: "boolean" }, gap: { type: "number" } },
  required: ["known", "gap"],
} as const;
/** Compare explicit assistance-code levels without inventing scale weights or interpreting independence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCode, secondCode, suppliedCodes, suppliedLevels } = request;
  const compute = (): Output => {
    H.sameLength(suppliedCodes, suppliedLevels);
    H.domain(new Set(suppliedCodes).size === suppliedCodes.length);
    return {
      known:
        suppliedCodes.includes(firstCode) && suppliedCodes.includes(secondCode),
      gap:
        suppliedCodes.includes(firstCode) && suppliedCodes.includes(secondCode)
          ? suppliedLevels[suppliedCodes.indexOf(secondCode)] -
            suppliedLevels[suppliedCodes.indexOf(firstCode)]
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstCode: "A",
    secondCode: "C",
    suppliedCodes: ["A", "B", "C"],
    suppliedLevels: [0, 1, 3],
  },
  output: { known: true, gap: 3 },
} satisfies ToolExample<Input, Output>;
export const taskAssistanceCodeLevelGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/task-assistance-code-level-gap",
    title: "Task Assistance Code Level Gap Tool",
    description:
      "Compare explicit assistance-code levels without inventing scale weights or interpreting independence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCode: { type: "string", maxLength: 8192 },
        secondCode: { type: "string", maxLength: 8192 },
        suppliedCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedLevels: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["firstCode", "secondCode", "suppliedCodes", "suppliedLevels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { known: { type: "boolean" }, gap: { type: "number" } },
      required: ["known", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "firstCode",
          label: "First Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondCode",
          label: "Second Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCodes",
          label: "Supplied Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedLevels",
          label: "Supplied Levels",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "boolean" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = taskAssistanceCodeLevelGapTool.execute;
export default taskAssistanceCodeLevelGapTool;
