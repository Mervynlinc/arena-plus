import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const file = join(process.cwd(), 'node_modules/@kauza/react-native-geckoview/android/build.gradle');
try {
  let content = readFileSync(file, 'utf8');
  if (content.includes('jcenter()')) {
    content = content.replace(/jcenter\(\)/g, 'mavenCentral()');
    writeFileSync(file, content, 'utf8');
    console.log('Patched geckoview build.gradle');
  }
} catch (e) {
  console.warn('Patch skipped:', e.message);
}
