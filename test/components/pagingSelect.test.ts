import { test, expect } from 'vitest';
/* import { mount } from '@vue/test-utils';*/
import PagingSelect from '@/components/PagingSelect/index.vue';

test('mount component', async() => {
  expect(PagingSelect).toBeTruthy();

  /* const wrapper = mount(PagingSelect);*/

  /* console.log('wrapper', wrapper.vm);*/

  /* await wrapper.find('button').trigger('click');

  await flushPromises(); // start loading, so vitest started loading
  await vi.dynamicImportSettled();

  expect(wrapper.html()).toContain('1 x 2 = 2');*/
});
