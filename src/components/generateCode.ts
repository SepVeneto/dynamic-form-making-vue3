export default function generateCode(config: Config) {
  return [
    '<template>',
    '  <dynamic-form :config="config" ></dynamic-form>',
    '</template>',
    '',
    '<script lang="ts">',
    'export default defineComponent({',
    '  name: "test"',
    '})',
    '</script>',
    '',
    '<script lang="ts" setup>',
    `const config = ${JSON.stringify(config)}`,
    '</script>',
  ].join('\n')
}
