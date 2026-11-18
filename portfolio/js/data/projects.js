'use strict'

import { landings } from "./landings.js";
import { email } from "./email.js";
import { apps } from "./apps.js";
import { react } from "./react.js";

export const projects = {
  ...landings,
  ...email,
  ...apps,
  ...react
}