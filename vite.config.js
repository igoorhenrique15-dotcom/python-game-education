import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function blackBusterCoursePlugin() {
  const virtualId = '\0black-buster-course';

  return {
    name: 'black-buster-course',
    enforce: 'pre',
    resolveId(source) {
      if (source === './data/course.json' || source.endsWith('/data/course.json')) {
        return virtualId;
      }
      return null;
    },
    load(id) {
      if (id !== virtualId) return null;
      const file = path.resolve(process.cwd(), 'src/data/course.json');
      const raw = fs.readFileSync(file, 'utf8');
      return `export default ${raw};`;
    },
  };
}

export default defineConfig({
  plugins: [blackBusterCoursePlugin(), react()],
  base: '/python-game-education/'
});
