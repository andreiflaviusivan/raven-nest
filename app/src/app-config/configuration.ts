import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'conf/config.yml';

export default () => {
  return yaml.load(
    readFileSync(join(YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};