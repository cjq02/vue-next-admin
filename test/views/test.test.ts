import { test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import AsAsync from '@/views/sys/test/components/Vitest/index.vue';

test('mount component', async() => {
  expect(AsAsync).toBeTruthy();

  const wrapper = mount(AsAsync);

  /* console.log('wrapper', wrapper);*/

  await wrapper.find('button').trigger('click');

  await flushPromises(); // start loading, so vitest started loading
  await vi.dynamicImportSettled();

  expect(wrapper.html()).toContain('1 x 2 = 2');
});
