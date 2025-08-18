/**
 * Types for shortcut creation and building
 */

export interface ShortcutDefinition {
  name: string;
  description?: string;
  icon?: string;
  color?: ShortcutColor;
  actions: ActionDefinition[];
  inputType?: ShortcutInputType;
  outputType?: ShortcutOutputType;
}

export interface ActionDefinition {
  type: ActionType;
  identifier: string;
  parameters?: Record<string, any>;
  uuid?: string;
}

export enum ActionType {
  // Text actions
  TEXT = 'is.workflow.actions.text',
  ASK_FOR_INPUT = 'is.workflow.actions.ask',
  SHOW_RESULT = 'is.workflow.actions.showresult',
  
  // Date & Time
  DATE = 'is.workflow.actions.date',
  FORMAT_DATE = 'is.workflow.actions.format.date',
  
  // Device
  GET_DEVICE_DETAILS = 'is.workflow.actions.getdevicedetails',
  GET_BATTERY_LEVEL = 'is.workflow.actions.getbatterylevel',
  
  // Files
  GET_FILE = 'is.workflow.actions.documentpicker.open',
  SAVE_FILE = 'is.workflow.actions.documentpicker.save',
  GET_CONTENTS_OF_FOLDER = 'is.workflow.actions.file.getcontentsoffolder',
  
  // Web
  GET_CONTENTS_OF_URL = 'is.workflow.actions.downloadurl',
  GET_CURRENT_WEATHER = 'is.workflow.actions.weather.currentconditions',
  
  // Communication
  SEND_MESSAGE = 'is.workflow.actions.sendmessage',
  MAKE_PHONE_CALL = 'is.workflow.actions.phone',
  SEND_EMAIL = 'is.workflow.actions.sendemail',
  
  // Apps
  OPEN_APP = 'is.workflow.actions.openapp',
  GET_MY_SHORTCUTS = 'is.workflow.actions.getmyshortcuts',
  RUN_SHORTCUT = 'is.workflow.actions.runworkflow',
  
  // Scripting
  RUN_SHELL_SCRIPT = 'is.workflow.actions.runshellscript',
  RUN_APPLESCRIPT = 'is.workflow.actions.applescript',
  
  // Logic
  IF = 'is.workflow.actions.conditional',
  CHOOSE_FROM_MENU = 'is.workflow.actions.choosefrommenu',
  REPEAT = 'is.workflow.actions.repeat.count',
  
  // Variables
  SET_VARIABLE = 'is.workflow.actions.setvariable',
  GET_VARIABLE = 'is.workflow.actions.getvariable'
}

export enum ShortcutColor {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  PURPLE = 'purple',
  PINK = 'pink',
  GRAY = 'gray'
}

export enum ShortcutInputType {
  TEXT = 'Text',
  NUMBER = 'Number',
  URL = 'URL',
  DATE = 'Date',
  FILE = 'File',
  IMAGE = 'Image',
  LOCATION = 'Location'
}

export enum ShortcutOutputType {
  TEXT = 'Text',
  NUMBER = 'Number',
  URL = 'URL',
  DATE = 'Date',
  FILE = 'File',
  IMAGE = 'Image'
}

export interface ShortcutTemplate {
  name: string;
  description: string;
  category: string;
  definition: ShortcutDefinition;
  examples?: ShortcutExample[];
}

export interface ShortcutExample {
  name: string;
  input?: any;
  expectedOutput?: any;
  description: string;
}

export interface ShortcutCreationRequest {
  definition: ShortcutDefinition;
  overwriteExisting?: boolean;
  validate?: boolean;
}

export interface ShortcutCreationResult {
  success: boolean;
  shortcutName?: string;
  error?: string;
  warnings?: string[];
  validationResults?: BuilderValidationResult[];
}

export interface BuilderValidationResult {
  valid: boolean;
  errors: BuilderValidationError[];
  warnings: BuilderValidationWarning[];
}

export interface BuilderValidationError {
  code: string;
  message: string;
  actionIndex?: number;
  parameter?: string;
}

export interface BuilderValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
  actionIndex?: number;
}
