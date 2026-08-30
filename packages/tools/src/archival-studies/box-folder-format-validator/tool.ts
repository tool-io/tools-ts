import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, shape } from "../shared.js";
export type Input = Readonly<{
  readonly boxFolderIdentifier: string;
  readonly declaredBoxFolderCapacities: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly validHierarchicalIdentifier: boolean;
  readonly parsedBoxFolderNumbers: readonly number[];
  readonly declaredBoxFound: boolean;
  readonly folderWithinDeclaredBoxCapacity: boolean;
}>;
const inputFields = [
  { id: "boxFolderIdentifier", label: "Box folder identifier", kind: "string" },
  {
    id: "declaredBoxFolderCapacities",
    label: "Declared box folder capacities",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    shape(input.declaredBoxFolderCapacities, "capacities") !== 2 ||
    !input.boxFolderIdentifier.length ||
    input.boxFolderIdentifier.length > 64
  )
    simpleError(
      "identifier",
      "Bounded identifier and box/capacity pairs required.",
    );
  input.declaredBoxFolderCapacities.forEach((r) => {
    count(r[0], "box", 1);
    count(r[1], "folders");
  });
  if (
    new Set(input.declaredBoxFolderCapacities.map((r) => r[0])).size !==
    input.declaredBoxFolderCapacities.length
  )
    simpleError("box", "Unique declared boxes required.");
  const m = /^B([1-9][0-9]{0,8})\/F([1-9][0-9]{0,8})$/.exec(
      input.boxFolderIdentifier,
    ),
    p = m ? m.slice(1).map(Number) : [],
    row = m
      ? input.declaredBoxFolderCapacities.find((r) => r[0] === p[0])
      : undefined;
  return {
    validHierarchicalIdentifier: m !== null,
    parsedBoxFolderNumbers: p,
    declaredBoxFound: row !== undefined,
    folderWithinDeclaredBoxCapacity: row !== undefined && p[1] <= row[1],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  boxFolderIdentifier: "B12/F3",
  declaredBoxFolderCapacities: [
    [12, 5],
    [13, 2],
  ],
} satisfies Input;
export const exampleOutput = {
  validHierarchicalIdentifier: true,
  parsedBoxFolderNumbers: [12, 3],
  declaredBoxFound: true,
  folderWithinDeclaredBoxCapacity: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/box-folder-format-validator",
  title: "Box-Folder Hierarchical Number Format Validator",
  description:
    "Validate exact Bn/Fn hierarchy and resolve folder number against caller declared box inventory; syntactic validity alone does not prove a box/folder exists.",
  inputs: inputFields,
  outputs: [
    {
      id: "validHierarchicalIdentifier",
      label: "Valid hierarchical identifier",
      kind: "boolean",
    },
    {
      id: "parsedBoxFolderNumbers",
      label: "Parsed box folder numbers",
      kind: "numberList",
    },
    { id: "declaredBoxFound", label: "Declared box found", kind: "boolean" },
    {
      id: "folderWithinDeclaredBoxCapacity",
      label: "Folder within declared box capacity",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      boxFolderIdentifier: value.boxFolderIdentifier as string,
      declaredBoxFolderCapacities:
        value.declaredBoxFolderCapacities as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
