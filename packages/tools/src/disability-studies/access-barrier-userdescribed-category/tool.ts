import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly userDescription: string;
  readonly chosenCategory: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    userDescription: { type: "string", maxLength: 8192 },
    chosenCategory: { type: "string", maxLength: 8192 },
  },
  required: ["userDescription", "chosenCategory"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve a user-described access barrier alongside a user-selected category without diagnosing disability or recoding the experience. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { userDescription, chosenCategory } = request;
  const compute = (): Output => {
    H.domain(
      userDescription.length > 0 && chosenCategory.length > 0,
      "userDescription",
    );
    return {
      label:
        JSON.stringify(userDescription) +
        " [user-selected category: " +
        chosenCategory +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    userDescription: "Door feels heavy",
    chosenCategory: "physical access",
  },
  output: {
    label: '"Door feels heavy" [user-selected category: physical access]',
  },
} satisfies ToolExample<Input, Output>;
export const accessBarrierUserdescribedCategoryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/access-barrier-userdescribed-category",
    title: "Access Barrier Userdescribed Category Tool",
    description:
      "Preserve a user-described access barrier alongside a user-selected category without diagnosing disability or recoding the experience.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        userDescription: { type: "string", maxLength: 8192 },
        chosenCategory: { type: "string", maxLength: 8192 },
      },
      required: ["userDescription", "chosenCategory"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "userDescription",
          label: "User Description",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "chosenCategory",
          label: "Chosen Category",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = accessBarrierUserdescribedCategoryTool.execute;
export default accessBarrierUserdescribedCategoryTool;
