import upperFirst from 'lodash.upperfirst';
import words from 'lodash.words';

export function pascalCase(input: string): string {
  return words(String(input).replace(/['\u2019]/g, '')).reduce((result, word) => {
    return result + upperFirst(word.toLowerCase());
  }, '');
}
