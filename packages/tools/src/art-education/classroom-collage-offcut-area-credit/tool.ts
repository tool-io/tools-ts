import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredArea: number;
  readonly offcutAreas: readonly number[];
  readonly usableFractions: readonly number[];
};
export type Output = {
  readonly usableOffcutArea: number;
  readonly newAreaNeeded: number;
  readonly surplus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredArea: { type: "number", minimum: 0 },
    offcutAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    usableFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["requiredArea", "offcutAreas", "usableFractions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableOffcutArea: { type: "number" },
    newAreaNeeded: { type: "number" },
    surplus: { type: "number" },
  },
  required: ["usableOffcutArea", "newAreaNeeded", "surplus"],
} as const;
/** Usable area accounting, excluding geometric nesting of irregular offcuts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredArea, offcutAreas, usableFractions } = request;
  const compute = (): Output => {
    H.sameLength(offcutAreas, usableFractions);
    H.domain(
      requiredArea >= 0 &&
        offcutAreas.every((x) => x >= 0) &&
        usableFractions.every((x) => x >= 0 && x <= 1),
    );
    return {
      usableOffcutArea: H.dot(offcutAreas, usableFractions),
      newAreaNeeded: Math.max(
        0,
        requiredArea - H.dot(offcutAreas, usableFractions),
      ),
      surplus: Math.max(0, H.dot(offcutAreas, usableFractions) - requiredArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredArea: 100,
    offcutAreas: [40, 60],
    usableFractions: [0.5, 0.5],
  },
  output: { usableOffcutArea: 50, newAreaNeeded: 50, surplus: 0 },
} satisfies ToolExample<Input, Output>;
export const classroomCollageOffcutAreaCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/classroom-collage-offcut-area-credit",
    title: "Classroom Collage Offcut Area Credit Tool",
    description:
      "Usable area accounting, excluding geometric nesting of irregular offcuts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredArea: { type: "number", minimum: 0 },
        offcutAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        usableFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["requiredArea", "offcutAreas", "usableFractions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableOffcutArea: { type: "number" },
        newAreaNeeded: { type: "number" },
        surplus: { type: "number" },
      },
      required: ["usableOffcutArea", "newAreaNeeded", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "requiredArea",
          label: "Required Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offcutAreas",
          label: "Offcut Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "usableFractions",
          label: "Usable Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "usableOffcutArea",
          label: "Usable Offcut Area",
          valueType: { type: "number" },
        },
        {
          id: "newAreaNeeded",
          label: "New Area Needed",
          valueType: { type: "number" },
        },
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = classroomCollageOffcutAreaCreditTool.execute;
export default classroomCollageOffcutAreaCreditTool;
