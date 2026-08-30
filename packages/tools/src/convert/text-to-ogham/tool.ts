import { ogham as config } from "../text-script/presets.js";
import { createTextScriptModule } from "../text-script/shared.js";
const module = createTextScriptModule(config);
export const example = module.example;
export const textScriptTool = module.tool;
export const runTextScript = module.run;
export default textScriptTool;
