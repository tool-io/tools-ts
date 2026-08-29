import type { ToolContract, ToolExecutionContext } from "./core/definition.js";
import type { ToolExample } from "./core/example.js";
import { portableToolContract } from "./core/portable-contract.js";
import type { ToolResult } from "./core/result.js";
import {
  loadTool,
  loadToolModule,
  type RegisteredTool,
  type RegisteredToolModule,
} from "./registry.js";

export {
  loadTool,
  loadToolModule,
  type RegisteredTool,
  type RegisteredToolModule,
};

export const getToolExample = async (
  id: string,
): Promise<ToolExample<unknown, unknown> | undefined> =>
  (await loadToolModule(id))?.example;

export const getToolContract = async (
  id: string,
): Promise<ToolContract | undefined> => {
  const tool = await loadTool(id);
  return tool && portableToolContract(tool);
};

export const executeTool = async (
  id: string,
  input: unknown,
  context?: ToolExecutionContext,
): Promise<ToolResult<unknown> | undefined> =>
  (await loadTool(id))?.execute(input, context);
