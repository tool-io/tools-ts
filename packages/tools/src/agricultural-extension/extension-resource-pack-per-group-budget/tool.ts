import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packs: number;
  readonly packsPerGroup: number;
  readonly reserved: number;
};
export type Output = {
  readonly completeGroups: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packs: { type: "integer", minimum: 0 },
    packsPerGroup: { type: "integer", minimum: 1 },
    reserved: { type: "integer", minimum: 0 },
  },
  required: ["packs", "packsPerGroup", "reserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completeGroups: { type: "integer" },
    remainder: { type: "integer" },
  },
  required: ["completeGroups", "remainder"],
} as const;
/** Calculate extension resource pack per group budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packs, packsPerGroup, reserved } = request;
  const compute = (): Output => {
    H.integer(packs, 0);
    H.integer(packsPerGroup, 1);
    H.integer(reserved, 0, packs);
    return {
      completeGroups: Math.floor((packs - reserved) / packsPerGroup),
      remainder: (packs - reserved) % packsPerGroup,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packs: 100, packsPerGroup: 6, reserved: 10 },
  output: { completeGroups: 15, remainder: 0 },
} satisfies ToolExample<Input, Output>;
export const extensionResourcePackPerGroupBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/extension-resource-pack-per-group-budget",
      title: "Extension Resource Pack Per Group Budget Tool",
      description:
        "Calculate extension resource pack per group budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          packs: { type: "integer", minimum: 0 },
          packsPerGroup: { type: "integer", minimum: 1 },
          reserved: { type: "integer", minimum: 0 },
        },
        required: ["packs", "packsPerGroup", "reserved"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          completeGroups: { type: "integer" },
          remainder: { type: "integer" },
        },
        required: ["completeGroups", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "packs",
            label: "Packs",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "packsPerGroup",
            label: "Packs Per Group",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reserved",
            label: "Reserved",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "completeGroups",
            label: "Complete Groups",
            valueType: { type: "integer" },
          },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = extensionResourcePackPerGroupBudgetTool.execute;
export default extensionResourcePackPerGroupBudgetTool;
